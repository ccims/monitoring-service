import { Injectable, HttpService, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class MonitorService {
  monitorFreqency = 5000;
  cpuIssueThreshold = 50;
  cpuEndpoints = ['http://localhost:3000/cpu'];

  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    setInterval(async () => {
      this.getCpuLoads();
    }, this.monitorFreqency);
  }

  async getCpuLoads() {
    this.cpuEndpoints.map(async (url) => {
      const res = await this.httpService.get(url).toPromise();
      const cpuLoad = res.data;
      if (cpuLoad > this.cpuIssueThreshold) {
        this.logger.warn(`Cirtical CPU Load: ${cpuLoad} at ${url}`);
      }
      return res.data;
    });
  }
}
