import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PessoasService } from '../services/pessoas.service';

@ApiTags('pessoas')
@ApiBearerAuth()
@Controller('sankhya/pessoas')
@UseGuards(AuthGuard('jwt'))
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Get()
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'cpfCnpj', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'telefone', required: false })
  @ApiQuery({ name: 'ativo', required: false })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresa', required: false })
  @ApiQuery({ name: 'departamento', required: false })
  @ApiQuery({ name: 'cargo', required: false })
  @ApiQuery({ name: 'situacao', required: false })
  @ApiQuery({ name: 'cliente', required: false, description: "'S' para sim, 'N' para não" })
  @ApiQuery({ name: 'fornecedor', required: false, description: "'S' para sim, 'N' para não" })
  @ApiQuery({ name: 'transportadora', required: false, description: "'S' para sim, 'N' para não" })
  @ApiQuery({ name: 'vendedor', required: false, description: "'S' para sim, 'N' para não" })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'perPage', required: false, schema: { default: 10 } })
  async listAll(
    @Query('nome') nome?: string,
    @Query('cpfCnpj') cpfCnpj?: string,
    @Query('email') email?: string,
    @Query('telefone') telefone?: string,
    @Query('ativo') ativo?: string,
    @Query('tipo') tipo?: string,
    @Query('empresa') empresa?: string,
    @Query('departamento') departamento?: string,
    @Query('cargo') cargo?: string,
    @Query('situacao') situacao?: string,
    @Query('cliente') cliente?: string,
    @Query('fornecedor') fornecedor?: string,
    @Query('transportadora') transportadora?: string,
    @Query('vendedor') vendedor?: string,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
  ) {
    return this.pessoasService.listAll({
      nome,
      cpfCnpj,
      email,
      telefone,
      ativo,
      tipo: (['cliente','fornecedor','funcionario','transportadora','vendedor'].includes(tipo as string) ? tipo as any : undefined),
      empresa,
      departamento,
      cargo,
      situacao,
      cliente,
      fornecedor,
      transportadora,
      vendedor,
      page: Number(page),
      perPage: Number(perPage),
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 123, description: 'ID do parceiro (CODPARC)' })
  async getById(@Param('id') id: string) {
    return this.pessoasService.getById(Number(id));
  }
}
