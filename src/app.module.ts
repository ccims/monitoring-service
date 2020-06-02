import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitorService } from './monitor.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    HttpModule,
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: './static/cpu-repot.json',
        }),
        new winston.transports.Console()
      ]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static')
    })
  ],
  controllers: [AppController],
  providers: [MonitorService],
})
export class AppModule {}
