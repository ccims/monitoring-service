import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { MonitorService } from './monitor.service';
import { HttpModule } from '@nestjs/common';
import { LoggingModule } from 'logging-module';
import { CpuEventsGateway } from './cpu-events.gateway';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        LoggingModule
      ],
      controllers: [AppController],
      providers: [
        MonitorService,
        CpuEventsGateway,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

});


// describe('App Controller', () => {
//   let controller: AppController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AppController],
//       providers: [
//         MonitorService,
//         CpuEventsGateway,
//       ],
//     }).compile();

//     console.log("?????????")
//     controller = module.get<AppController>(AppController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
