import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CpuObservationEndpoint } from 'cpu-monitoring-models';
import { LoggingModule } from 'logging-module';
import { MonitorService } from './monitor.service';

describe('MonitorService', () => {
    let monitorService: MonitorService;
    const testEndpoint = new CpuObservationEndpoint(
        "Database Service",
        'http://localhost:3000/cpu',
        50,
        0,
        2000
      );

    beforeEach( async() => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, LoggingModule],
            providers:[MonitorService]
        }).compile();

        monitorService = app.get<MonitorService>(MonitorService);
    });

    it('should be defined', () => {
        expect(monitorService).toBeDefined();
    });

    it('should add an endpoint', () => {
        monitorService.addObservingEndpoint(testEndpoint);
        const endpoints = monitorService.getEndpoints();
        expect(endpoints).toContain(testEndpoint);
    });

    it('should edit an endpoint', () => {
        monitorService.addObservingEndpoint(testEndpoint);

        testEndpoint.minimalCpuUtilThreshold = 5;
        testEndpoint.criticalCpuUtilThreshold = 80;
        monitorService.editObservingEndpoint(testEndpoint);

        const endpoints = monitorService.getEndpoints();
        expect(endpoints.length).toBe(1);
        expect(endpoints[0].minimalCpuUtilThreshold).toBe(5);
        expect(endpoints[0].criticalCpuUtilThreshold).toBe(80);

    });

    it('should delete endpoints', () => {
        monitorService.addObservingEndpoint(testEndpoint);
        const anotherEndpoint = new CpuObservationEndpoint(
            "NonExisting Service",
            'http://localhost:3300/cpu',
            90,
            10,
            4000
          );
        monitorService.addObservingEndpoint(anotherEndpoint);

        let endpoints = monitorService.getEndpoints();
        expect(endpoints.length).toBe(2);

        monitorService.deleteObservingEndpoint(testEndpoint);
        endpoints = monitorService.getEndpoints();
        expect(endpoints.length).toBe(1);

        monitorService.deleteObservingEndpoint(anotherEndpoint);
        endpoints = monitorService.getEndpoints();
        expect(endpoints.length).toBe(0);
    });

    afterEach( () => {
        let endpoints: CpuObservationEndpoint[] = monitorService.getEndpoints();
        endpoints.forEach(function (value) {
            console.log(value);
            monitorService.deleteObservingEndpoint(value);
        });
    });


});