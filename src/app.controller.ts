import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CpuObservationEndpoint } from 'cpu-monitoring-models';

@Controller()
export class AppController {

  constructor(private readonly appService: MonitorService) {}

  @Get()
  getObservationEndpoints() {
    return this.appService.getEndpoints();
  }

  @Post()
  addObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.addObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }

  @Post('/edit')
  editObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.editObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }

  @Post('/delete')
  deleteObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.deleteObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }
}
