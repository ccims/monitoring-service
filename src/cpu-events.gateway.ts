import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MonitorService } from './monitor.service';

/**
 * emits event for each observation endpoint so frontend (or other services) can receive status of 
 * each observed endpoint
 */
@WebSocketGateway()
export class CpuEventsGateway {

    @WebSocketServer() server;

    constructor(private monitorService: MonitorService) {
        // Listen to Status Changes from Endpoints and emit the events for the corresponding socket
        monitorService.notifyListeners.subscribe((status) => {
            if (this.server) {
                this.server.emit(status.observationEndpointid, status)
            }
        })
    }
}