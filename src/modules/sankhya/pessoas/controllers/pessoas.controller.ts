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
  @ApiQuery({ name: 'nome', required: false, example: 'João da Silva' })
  @ApiQuery({ name: 'cpfCnpj', required: false, example: '123.456.789-00' })
  @ApiQuery({ name: 'email', required: false, example: 'joao@email.com' })
  @ApiQuery({ name: 'telefone', required: false, example: '(11) 99999-9999' })
  @ApiQuery({ name: 'ativo', required: false, example: '1' })
  @ApiQuery({ name: 'tipo', required: false, example: 'cliente' })
  @ApiQuery({ name: 'empresa', required: false, example: 'EMPRESA XYZ' })
  @ApiQuery({ name: 'departamento', required: false, example: 'TI' })
  @ApiQuery({ name: 'cargo', required: false, example: 'Analista' })
  @ApiQuery({ name: 'situacao', required: false, example: '1', description: 'Situação do funcionário (1=Ativo, 0=Demitido, etc)' })
  @ApiQuery({ name: 'page', required: false, example: 1, schema: { default: 1 } })
  @ApiQuery({ name: 'perPage', required: false, example: 10, schema: { default: 10 } })
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
