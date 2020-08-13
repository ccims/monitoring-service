import { Injectable, HttpService, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuObserver } from './cpu-observer';
import { Subject } from 'rxjs';
import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { IssueLoggingService } from 'logging-module';

// Initial Endpoint for demo purpose
const initialEndpoint = new CpuObservationEndpoint(
  "Database Service",
  'http://localhost:3000/cpu',
  50,
  0,
  2000
)

/** 
  Monitoring Services handles the state of the current endpoints and creates CpuObserver for each endpoint
*/
@Injectable()
export class MonitorService {

  private endpoints: { [id: string]: CpuObservationEndpoint } = {};
  private observers: { [id: string]: CpuObserver };

  public notifyListeners = new Subject<CpuObservationStatus>();

  constructor(
    private httpService: HttpService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private logger: IssueLoggingService
  ) {
    //this.endpoints[initialEndpoint.id] = initialEndpoint;
    this.startAllObservers();
  }

  _notifyObservationListeners(status: CpuObservationStatus) {
    this.notifyListeners.next(status);

  }

  /**
   * Create an observer for all endpoints
   */
  private startAllObservers() {
    this.observers = {};
    Object.values(this.endpoints).forEach((endpoint) => this.observers[endpoint.id] = this.startObserver(endpoint));
  }

  /**
   * create a new CpuObserver with the specified data
   * @param endpoint the given cpu endpoint
   * @returns a new cpu observer with the endpoint data
   */
  private startObserver(endpoint: CpuObservationEndpoint): CpuObserver {
    return new CpuObserver(endpoint, this.httpService, this.logger, this._notifyObservationListeners.bind(this))
  }

  /**
   * adding a cpu observer for the specified endpoint
   * @param endpoint the given cpu endpoint
   */
  addObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }
  /**
   * creating a enw endpoint and creating a new endpoint with the endpoint data
   * @param endpoint the given cpu endpoint
   */
  editObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id].dispose();
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }
  /**
   * deleting the given cpu endpoint
   * @param endpoint the given cpu endpoint
   */
  deleteObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.observers[endpoint.id].dispose();
    delete this.observers[endpoint.id];
    delete this.endpoints[endpoint.id]
  }

  /**
   * return the end points as a list
   * @returns list of endpoints
   */
  getEndpoints() {
    return Object.values(this.endpoints);
  }
}
