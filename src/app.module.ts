import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitorService } from './monitor.service';
import { CpuEventsGateway } from './cpu-events.gateway';
import { LoggingModule } from 'logging-module'

@Module({
  imports: [
    HttpModule,
    LoggingModule
  ],
  controllers: [AppController],
  providers: [
    MonitorService,
    CpuEventsGateway,
  ],
})
export class AppModule {}
