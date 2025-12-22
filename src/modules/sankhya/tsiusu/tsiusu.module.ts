import { Module } from '@nestjs/common';
import { SqlServerService } from '../../../database/sqlserver.service';
import { TsiUsuController } from './controllers/tsiusu.controller';
import { TsiUsuService } from './services/tsiusu.service';

@Module({
  controllers: [TsiUsuController],
  providers: [TsiUsuService, SqlServerService],
})
export class TsiUsuModule {}
