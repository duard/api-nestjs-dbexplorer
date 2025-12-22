import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PessoasService } from '../services/pessoas.service';

@ApiTags('pessoas')
@ApiBearerAuth()
@Controller('sankhya/pessoas')
@UseGuards(AuthGuard('jwt'))
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Get()
  async listAll(
    @Query('nome') nome?: string,
    @Query('cpfCnpj') cpfCnpj?: string,
    @Query('email') email?: string,
    @Query('telefone') telefone?: string,
    @Query('ativo') ativo?: string,
    @Query('tipo') tipo?: string,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '20',
  ) {
    return this.pessoasService.listAll({
      nome,
      cpfCnpj,
      email,
      telefone,
      ativo,
      tipo,
      page: Number(page),
      perPage: Number(perPage),
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.pessoasService.getById(Number(id));
  }
}
