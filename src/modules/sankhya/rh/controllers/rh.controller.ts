import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RhService } from '../services/rh.service';
import { RhFiltersDto } from '../dto/rh-filters.dto';
import { RiscoEvasaoDto, CustoRescisaoDto } from '../dto/rh-reports.dto';

@ApiTags('RH - Recursos Humanos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('rh')
export class RhController {
  private readonly logger = new Logger(RhController.name);

  constructor(private readonly rhService: RhService) {}

  @Get('dashboard/executivo')
  @ApiOperation({ summary: 'Dashboard Executivo completo com todos os KPIs' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard executivo recuperado com sucesso',
  })
  async getDashboardExecutivo(@Query() filters: RhFiltersDto) {
    this.logger.log(
      `Buscando dashboard executivo com filtros: ${JSON.stringify(filters)}`,
    );
    return await this.rhService.getDashboardExecutivo(filters);
  }

  @Get('funcionarios/departamento')
  @ApiOperation({ summary: 'Funcionários por Departamento/Cargo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de funcionários por departamento recuperada',
  })
  async getFuncionariosPorDepartamento(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando funcionários por departamento');
    return await this.rhService.getFuncionariosPorDepartamento(filters);
  }

  @Get('turnover/filtros')
  @ApiOperation({ summary: 'Turnover com filtros avançados' })
  @ApiResponse({
    status: 200,
    description: 'Dados de turnover com filtros aplicados',
  })
  async getTurnoverComFiltros(@Query() filters: RhFiltersDto) {
    this.logger.log(
      `Buscando turnover com filtros: ${JSON.stringify(filters)}`,
    );
    return await this.rhService.getTurnoverComFiltros(filters);
  }

  @Get('analise/desligamentos')
  @ApiOperation({ summary: 'Análise detalhada de desligamentos' })
  @ApiResponse({
    status: 200,
    description: 'Análise de desligamentos recuperada',
  })
  async getAnaliseDesligamentos(@Query() filters: RhFiltersDto) {
    this.logger.log(
      `Buscando análise de desligamentos: ${JSON.stringify(filters)}`,
    );
    return await this.rhService.getAnaliseDesligamentos(filters);
  }

  @Get('estatisticas/gerais')
  @ApiOperation({ summary: 'Estatísticas gerais de RH' })
  @ApiResponse({ status: 200, description: 'Estatísticas gerais recuperadas' })
  async getEstatisticasGerais(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando estatísticas gerais');
    return await this.rhService.getEstatisticasGerais(filters);
  }

  @Get('risco/evasao')
  @ApiOperation({ summary: 'Score de risco de evasão de funcionários' })
  @ApiResponse({ status: 200, description: 'Score de risco evasão calculado' })
  async getScoreRiscoEvasao(@Query() filters: RiscoEvasaoDto) {
    this.logger.log(`Buscando score risco evasão: ${JSON.stringify(filters)}`);
    return await this.rhService.getScoreRiscoEvasao(filters);
  }

  @Get('custo/rescisao')
  @ApiOperation({ summary: 'Custo real de rescisões (TFPBAS)' })
  @ApiResponse({ status: 200, description: 'Custo de rescisão recuperado' })
  async getCustoRescisaoReal(@Query() filters: CustoRescisaoDto) {
    this.logger.log(`Buscando custo rescisão real: ${JSON.stringify(filters)}`);
    return await this.rhService.getCustoRescisaoReal(filters);
  }

  @Post('validar-filtros')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar filtros de RH' })
  @ApiResponse({ status: 200, description: 'Filtros validados' })
  async validarFiltros(@Body() filters: RhFiltersDto) {
    this.logger.log(`Validando filtros: ${JSON.stringify(filters)}`);
    return await this.rhService.validateFilters(filters);
  }

  @Get('resumo/turnover-departamento')
  @ApiOperation({ summary: 'Resumo de turnover por departamento' })
  @ApiResponse({ status: 200, description: 'Resumo turnover por departamento' })
  async getResumoTurnoverDepartamento(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando resumo turnover por departamento');
    // TODO: Implementar método no service quando disponível
    return { message: 'Endpoint em desenvolvimento' };
  }

  @Get('resumo/turnover-periodo')
  @ApiOperation({ summary: 'Resumo de turnover por período' })
  @ApiResponse({ status: 200, description: 'Resumo turnover por período' })
  async getResumoTurnoverPeriodo(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando resumo turnover por período');
    // TODO: Implementar método no service quando disponível
    return { message: 'Endpoint em desenvolvimento' };
  }

  @Get('tempo-empresa')
  @ApiOperation({ summary: 'Análise de tempo de empresa (antiguidade)' })
  @ApiResponse({ status: 200, description: 'Análise de tempo de empresa' })
  async getTempoEmpresa(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando análise de tempo de empresa');
    // TODO: Implementar método no service quando disponível
    return { message: 'Endpoint em desenvolvimento' };
  }

  @Get('faixa-etaria')
  @ApiOperation({ summary: 'Análise de faixa etária' })
  @ApiResponse({ status: 200, description: 'Análise de faixa etária' })
  async getFaixaEtaria(@Query() filters?: RhFiltersDto) {
    this.logger.log('Buscando análise de faixa etária');
    // TODO: Implementar método no service quando disponível
    return { message: 'Endpoint em desenvolvimento' };
  }
}
