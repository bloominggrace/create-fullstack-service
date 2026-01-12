import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import v8 from 'v8';

import { AppService } from './app.service';

function getHeapLimit(): number {
  return v8.getHeapStatistics().heap_size_limit * 0.9;
}

@Controller()
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly mikroOrmHealthIndicator: MikroOrmHealthIndicator,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health/liveness')
  @HealthCheck()
  getLivenessHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.memoryHealthIndicator.checkHeap('heap', getHeapLimit()),
      () => this.diskHealthIndicator.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('/health/readiness')
  @HealthCheck()
  getReadinessHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([() => this.mikroOrmHealthIndicator.pingCheck('database')]);
  }
}
