import { HttpService, Injectable } from '@nestjs/common';
import { CpuObservationEndpoint, CpuObservationStatus } from 'cpu-monitoring-models';
import { IssueLoggingService } from 'logging-module';
import { Subject } from 'rxjs';
import { CpuObserver } from './cpu-observer';


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
    private logger: IssueLoggingService
  ) {

    this.startAllObservers();
  }

  _notifyObservationListeners(status: CpuObservationStatus) {
    this.notifyListeners.next(status);

  }

  /**
   * Creates an observer for each endpoint
   */
  private startAllObservers() {
    this.observers = {};
    Object.values(this.endpoints).forEach((endpoint) => this.observers[endpoint.id] = this.startObserver(endpoint));
  }

  /**
   * Creates a new CpuObserver with the specified data
   * 
   * @param endpoint CPU endpoint that is going to be observed
   * @returns a new cpu observer with the endpoint data
   */
  private startObserver(endpoint: CpuObservationEndpoint): CpuObserver {
    return new CpuObserver(endpoint, this.httpService, this.logger, this._notifyObservationListeners.bind(this))
  }

  /**
   * adding a CPU observer for the specified endpoint
   * 
   * @param endpoint CPU endpoint that is going to be observed
   */
  addObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }
  /**
   * Updates place where old endpoint was saved and restarts observer with updated endpoint
   * 
   * @param endpoint observed CPU endpoint that is being updated
   */
  editObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.endpoints[endpoint.id] = endpoint;
    this.observers[endpoint.id].dispose();
    this.observers[endpoint.id] = this.startObserver(endpoint);
  }
  /**
   * Stops observing given CPU endpoint and deletes it from list
   * 
   * @param endpoint CPU endpoint that will be deleted
   */
  deleteObservingEndpoint(endpoint: CpuObservationEndpoint) {
    this.observers[endpoint.id].dispose();
    delete this.observers[endpoint.id];
    delete this.endpoints[endpoint.id]
  }

  /**
   * Get all observed CPU endpoints as a list
   * 
   * @returns list of observed CPU endpoints
   */
  getEndpoints() {
    return Object.values(this.endpoints);
  }
}
