import { Controller, Get, Post, Body } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CpuObservationEndpoint } from 'cpu-monitoring-models';

@Controller()
export class AppController {

  constructor(private readonly appService: MonitorService) {}

  @Get()
  getObservationEndpoints() {
    return this.appService.endpoints;
  }

  @Post()
  addObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.addObservingEndpoint(endpoint);
    return this.appService.endpoints;
  }
}
