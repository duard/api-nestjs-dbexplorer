import { Module } from '@nestjs/common';
import { SqlServerService } from 'src/database/sqlserver.service';
import { PessoasController } from './controllers/pessoas.controller';
import { PessoasService } from './services/pessoas.service';


@Module({
  controllers: [PessoasController],
  providers: [PessoasService, SqlServerService],
})
export class PessoasModule {}
