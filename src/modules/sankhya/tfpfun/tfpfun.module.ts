import { Module } from '@nestjs/common';
import { TFPFUNController } from './controllers/tfpfun.controller';
import { TFPFUNService } from './services/tfpfun.service';

import { SqlServerService } from 'src/database/sqlserver.service';

@Module({
  controllers: [TFPFUNController],
  providers: [TFPFUNService, SqlServerService],
})
export class TFPFUNModule {}
