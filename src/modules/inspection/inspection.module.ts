import { Module } from '@nestjs/common';
import { InspectionController } from './controllers/inspection.controller';
import { InspectionService } from './services/inspection.service';
import { SqlServerService } from 'src/database/sqlserver.service';

@Module({
  controllers: [InspectionController],
  providers: [InspectionService, SqlServerService],
  exports: [InspectionService],
})
export class InspectionModule {}
