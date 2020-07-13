import { HttpService } from "@nestjs/common";
import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { CpuUtilizationLogData, LogType } from "logging-format";
import { IssueLoggingService } from 'logging-module';

// Handles the periodic querying of the cpu status for a given endpoint
export class CpuObserver {

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
        this.stopObserving();
    }

    async checkCpuLoad() {
        const url = this.cpuObservationEndpoint.cpuUtilQueryEndpoint
        const status = new CpuObservationStatus(this.cpuObservationEndpoint.id);    // new status that will be emitted
        try {
            const res = await this.httpService.get(url).toPromise();
            status.cpuLoad = res.data;
            if (status.cpuLoad > this.cpuObservationEndpoint.criticalCpuUtilThreshold) {
                const message = `Critical CPU Load: ${status.cpuLoad} at ${url}`
                this.logWithData(url, message, status.cpuLoad);
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
    /**
     * Creates the Log which is send to the log-receiver, with the too high Cpu Load.  
     * @param url where the problem occurred.
     * @param message what the problem is.
     * @param cpuLoad the CpuLoad for the specific data of this Log
     */
    private logWithData(url, message, cpuLoad: number) {

        //Data of a too high Cpu utilization
        let cpuErrorData: CpuUtilizationLogData = {
            cpuUtilization: cpuLoad
        }

        this.logger.log({
            source: url,
            detector: null,
            time: new Date().getTime(),
            type: LogType.CPU,
            message: message,
            data: cpuErrorData
        });
    }
    /**
     * Creates the Log which is send to the log-receiver, without specific data.
     * @param url  where the problem occurred.
     * @param message what the problem is.
     */
    private log(url, message) {

        //declare an impossible outcome, because actual Cpu load isn't given
        let cpuErrorData: CpuUtilizationLogData = {
            cpuUtilization: -1
        }

        this.logger.log({
            source: url,
            detector: null,
            time: new Date().getTime(),
            type: LogType.CPU,
            message: message,
            data: cpuErrorData
        });
    }

    private stopObserving() {
        clearInterval(this.interval);
    }
}