import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { HttpService, Inject, Logger } from "@nestjs/common";
import { LogType, LogMessageFormat } from 'logging-format';
import { IssueLoggingService } from 'logging-module';

// Handles the periodic querying of the cpu status for a given endpoint
export class CpuObeserver {

    interval: NodeJS.Timeout;

    constructor(
        private cpuObservationEndpoint: CpuObservationEndpoint,
        private httpService: HttpService,
        private readonly logger: IssueLoggingService,
        private notify?: Function
    ) {
        this.startObserving();
    }

    private startObserving() {
        // Initial Cpu Query
        this.checkCpuLoad();
        // Query Cpu periodically
        this.interval = setInterval(async () => {
          this.checkCpuLoad();
        }, this.cpuObservationEndpoint.cpuObservationFrequencyMilis);
    }

    // Stop the observer when not needed
    dispose() {
        this.stopObersving();
    }

    async checkCpuLoad() {
        const url = this.cpuObservationEndpoint.cpuUtilQueryEndpoint
        const status = new CpuObservationStatus(this.cpuObservationEndpoint.id);    // new status that will be emitted
        try {
            const res = await this.httpService.get(url).toPromise();
            status.cpuLoad = res.data;
            if (status.cpuLoad > this.cpuObservationEndpoint.criticalCpuUtilThreshold) {
                const message = `Cirtical CPU Load: ${status.cpuLoad} at ${url}`;
                this.log(url, message, status.cpuLoad);
                status.message = message;
            } else if (status.cpuLoad < this.cpuObservationEndpoint.minimalCpuUtilThreshold) {
                const message = `CPU Load: ${status.cpuLoad} at ${url} is below the minimum threshold`;
                this.log(url, message, status.cpuLoad);
                status.message = message;
            } else {
                const message = `Cpu Utilization: ${status.cpuLoad}%`;
                status.message = message;
            }
            // notify about the status change
            this.notify(status);
        } catch (e) {
            if (e.code === "ECONNREFUSED") {
                const message = `Endpoint ${url} cannot be reached`;
                this.log(url, message, status.cpuLoad);
                status.message = message;
                this.notify(status);
            }
        }
    }

    private log(url, message, cpu) {
        this.logger.log({
            source: url,
            detector: null,
            time: new Date().getTime(),
            type: LogType.CPU,
            data: {
                cpuUtilization: cpu
            },
            message: message
        } as LogMessageFormat);
    }

    private stopObersving() {
        clearInterval(this.interval);
    }
}