import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MonitorService } from './monitor.service';


@WebSocketGateway()
export class CpuEventsGateway {

    @WebSocketServer() server;

    constructor(
        private monitorService: MonitorService
    ) {
        monitorService.notifyListeners.subscribe((status) => {
            this.server.emit(status.observationEndpointid, status)
        })
    }
}