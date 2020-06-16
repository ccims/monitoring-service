import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { HttpService, Inject, Logger } from "@nestjs/common";
import { LogType } from 'logging-format/dist/log-type';
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
                const message = `Cirtical CPU Load: ${status.cpuLoad} at ${url}`
                this.log(url, message);
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
                this.log(url, message);
                status.message = message;
                this.notify(status);
            }
        }
    }

    private log(url, message) {
        this.logger.log({
            source: url,
            target: null,
            time: new Date().getTime(),
            type: LogType.CPU,
            message: message
        });
    }

    private stopObersving() {
        clearInterval(this.interval);
    }
}