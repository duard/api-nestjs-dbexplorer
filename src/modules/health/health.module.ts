
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { SqlServerHealthIndicator } from './indicators/sqlserver.health';
import { SqlServerService } from 'src/database/sqlserver.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TerminusModule, ConfigModule],
  controllers: [HealthController],
  providers: [SqlServerHealthIndicator, SqlServerService],
})
export class HealthModule {}
