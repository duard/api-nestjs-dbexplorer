import { Module } from '@nestjs/common';
import { RhController } from './controllers/rh.controller';
import { RhService } from './services/rh.service';
import { SqlServerService } from '../../../database/sqlserver.service';

@Module({
  controllers: [RhController],
  providers: [RhService, SqlServerService],
  exports: [RhService],
})
export class RhModule {}
