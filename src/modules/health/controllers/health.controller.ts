
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { SqlServerHealthIndicator } from '../indicators/sqlserver.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private sql: SqlServerHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.sql.isHealthy('sqlserver'),
    ]);
  }
}
