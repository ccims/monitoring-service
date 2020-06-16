import { Injectable, HttpService, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuObeserver } from './cpu-observer';
import { Subject } from 'rxjs';
import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { IssueLoggingService } from './logging/logging.service';
import { LogType } from './logging/log-type';

// Initial Endpoint for demo porpuse
const initialEndpoint = new CpuObservationEndpoint(
  "Database Service",
  'http://localhost:3000/cpu',
  50,
  2000
)

/*
  Monitoring Services handles the state of the current endpoints and creates CpuObeserver for each endpoint
*/
@Injectable()
export class MonitorService {

  private endpoints: { [id: string] : CpuObservationEndpoint } = {};
  private observers: { [id: string] : CpuObeserver };

  public notifyListeners = new Subject<CpuObservationStatus>();

  constructor(
    private httpService: HttpService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private logger: IssueLoggingService
  ) {
    this.endpoints[initialEndpoint.id] = initialEndpoint;
    this.startAllObervers();
  }

  _notifyObservationListeners(status: CpuObservationStatus) {
    this.notifyListeners.next(status);

  }

  // Create an oberserver for all endpoints
  private startAllObervers() {
    this.observers = {};
    Object.values(this.endpoints).forEach((endpoint) => this.observers[endpoint.id] = this.startObserver(endpoint));
  }

  private startObserver(endpoint: CpuObservationEndpoint): CpuObeserver {
    return new CpuObeserver(endpoint, this.httpService, this.logger, this._notifyObservationListeners.bind(this))
  }

  addObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }

  editObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id].dispose();
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }

  deleteObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.observers[endpoint.id].dispose();
    delete this.observers[endpoint.id];
    delete this.endpoints[endpoint.id]
  }

  getEndpoints() {
    // return endpoints as a list
    return Object.values(this.endpoints);
  }
}
