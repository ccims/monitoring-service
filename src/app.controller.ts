import { Controller, Get } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller()
export class AppController {

  constructor(private readonly appService: MonitorService) {}

}
