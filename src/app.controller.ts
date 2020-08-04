import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CpuObservationEndpoint } from 'cpu-monitoring-models';

/**
 * Controller to receive requests to add, edit and delete the cpu observation endpoints
 */
@Controller()
export class AppController {

  constructor(private readonly appService: MonitorService) { }

  /**
   * Get requests that attempt to fetch the endpoints will be handled here
   */
  @Get()
  getObservationEndpoints() {
    return this.appService.getEndpoints();
  }
  /**
   * Post requests to this endpoint will be handled here and adds the specified endpoint
   * @param endpoint the endpoint object specified in the post body
   */
  @Post()
  addObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.addObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }
  /**
   * Post requests to the endpoint /edit will be handled here and it edits the spcified 
   * endpoint with new data
   * @param endpoint the endpoint object specified in the post body
   */
  @Post('/edit')
  editObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.editObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }
  /**
   * Post requests to the endpoint /delete will be handled here and deletes an endpoint
   * @param endpoint the endpoint object specified in the post body
   */
  @Post('/delete')
  deleteObservationEndpoint(@Body() endpoint: CpuObservationEndpoint) {
    this.appService.deleteObservingEndpoint(endpoint);
    return this.appService.getEndpoints();
  }
}
