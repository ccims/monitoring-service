import { Injectable, HttpService, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuObeserver } from './cpu-observer';
import { Subject } from 'rxjs';
import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';


/*
The monitoring service checks the cpu utilization load of the service b periodically
with a certain frequency.
*/
@Injectable()
export class MonitorService {

  public endpoints: CpuObservationEndpoint[] = [
    new CpuObservationEndpoint(
      "Database Service",
      'http://localhost:3000/cpu',
      50,
      2000
    )
  ];

  private observers: CpuObeserver[];

  public notifyListeners = new Subject<CpuObservationStatus>();

  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.startAllObervers();
  }

  _notifyObservationListeners(status: CpuObservationStatus) {
    this.notifyListeners.next(status);
  }

  private startAllObervers() {
    this.observers = [];
    this.endpoints.forEach((endpoint) => this.startObserver(endpoint));
  }

  private startObserver(endpoint: CpuObservationEndpoint) {
    this.observers.push(
      new CpuObeserver(endpoint, this.httpService, this.logger, this._notifyObservationListeners.bind(this))
    );
  }

  addObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints.push(endpoint);
    this.startObserver(endpoint);
  }
}
