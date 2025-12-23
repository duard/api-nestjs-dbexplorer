import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { TFPFUNService } from '../services/tfpfun.service';

@Controller('sankhya/tfpfun')
export class TFPFUNController {
  constructor(private readonly tfpfunService: TFPFUNService) {}

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return this.tfpfunService.findAll(query);
  }

  @Get(':codemp/:codfunc')
  async findById(@Param('codemp') codemp: number, @Param('codfunc') codfunc: number) {
    return this.tfpfunService.findById(codemp, codfunc);
  }
}
