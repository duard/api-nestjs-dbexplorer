import { Module } from '@nestjs/common';
import { TFPFUNController } from './controllers/tfpfun.controller';
import { TFPFUNService } from './services/tfpfun.service';

@Module({
  controllers: [TFPFUNController],
  providers: [TFPFUNService],
})
export class TFPFUNModule {}
