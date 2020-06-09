import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitorService } from './monitor.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CpuEventsGateway } from './cpu-events.gateway';

@Module({
  imports: [
    HttpModule,
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: './static/cpu-report.json',
        }),
        new winston.transports.Console()
      ]
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'static')
    // })
  ],
  controllers: [AppController],
  providers: [
    MonitorService,
    CpuEventsGateway
  ],
})
export class AppModule {}
