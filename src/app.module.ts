import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitorService } from './monitor.service';
import { CpuEventsGateway } from './cpu-events.gateway';
import { LoggingModule } from 'logging-module';
import { ConfigModule } from '@nestjs/config';
 

@Module({
  imports: [
    HttpModule,
    LoggingModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    MonitorService,
    CpuEventsGateway,
  ],
})
export class AppModule {}
