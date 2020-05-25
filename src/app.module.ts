import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitorService } from './monitor.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    HttpModule,
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: 'cpu-repot.json',
        }),
        new winston.transports.Console()
      ]
    }),
  ],
  controllers: [AppController],
  providers: [MonitorService],
})
export class AppModule {}
