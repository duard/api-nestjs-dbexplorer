import { Module } from '@nestjs/common';
import { SqlServerService } from 'src/database/sqlserver.service';
import { PortoesController } from './controllers/portoes.controller';
import { PortoesService } from './services/portoes.service';

@Module({
  controllers: [PortoesController],
  providers: [PortoesService, SqlServerService],
})
export class PortoesModule {}
