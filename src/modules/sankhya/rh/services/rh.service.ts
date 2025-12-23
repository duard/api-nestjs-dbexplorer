import { Injectable, Logger } from '@nestjs/common';
import { SqlServerService } from '../../../../database/sqlserver.service';
import { RhFiltersDto, RhQueryDto } from '../dto/rh-filters.dto';
import { RiscoEvasaoDto, CustoRescisaoDto } from '../dto/rh-reports.dto';
import {
  TurnoverFilters,
  TurnoverQueryBuilder,
} from '../dashboard-data/interfaces/turnover-filters.interface';

// Importar queries existentes
import { getDashboardExecutivoQuery } from '../dashboard-data/queries/dashboard-executivo.query';
import {
  getFuncionariosPorDepartamentoQuery,
  getTurnoverComFiltrosQuery,
  getAnaliseDesligamentosQuery,
  getEstatisticasGeraisQuery,
} from '../dashboard-data/queries/turnover.queries';
import { getScoreRiscoEvasaoQuery } from '../dashboard-data/queries/score-risco-evasao.query';
import { getCustoRescisaoRealQuery } from '../dashboard-data/queries/custo-rescisao-real.query';

@Injectable()
export class RhService {
  private readonly logger = new Logger(RhService.name);

  constructor(private readonly databaseService: SqlServerService) {}

  async getDashboardExecutivo(filters: RhFiltersDto) {
    try {
      const query = getDashboardExecutivoQuery(filters);
      this.logger.debug(
        `Executando dashboard executivo com filtros: ${JSON.stringify(filters)}`,
      );
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao executar dashboard executivo', error);
      throw error;
    }
  }

  async getFuncionariosPorDepartamento(filters?: RhFiltersDto) {
    try {
      const query = getFuncionariosPorDepartamentoQuery;
      this.logger.debug('Executando consulta de funcionários por departamento');
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error(
        'Erro ao consultar funcionários por departamento',
        error,
      );
      throw error;
    }
  }

  async getTurnoverComFiltros(filters: RhFiltersDto) {
    try {
      const { dataInicio, dataFim } =
        TurnoverQueryBuilder.getDateRange(filters);
      const query = getTurnoverComFiltrosQuery
        .replace('@dataInicio', `'${dataInicio}'`)
        .replace('@dataFim', `'${dataFim}'`);

      this.logger.debug(
        `Executando turnover com filtros: ${JSON.stringify(filters)}`,
      );
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao consultar turnover com filtros', error);
      throw error;
    }
  }

  async getAnaliseDesligamentos(filters: RhFiltersDto) {
    try {
      const { dataInicio, dataFim } =
        TurnoverQueryBuilder.getDateRange(filters);
      const query = getAnaliseDesligamentosQuery
        .replace('@dataInicio', `'${dataInicio}'`)
        .replace('@dataFim', `'${dataFim}'`);

      this.logger.debug(
        `Executando análise de desligamentos: ${dataInicio} a ${dataFim}`,
      );
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao consultar análise de desligamentos', error);
      throw error;
    }
  }

  async getEstatisticasGerais(filters?: RhFiltersDto) {
    try {
      const query = getEstatisticasGeraisQuery;
      this.logger.debug('Executando estatísticas gerais');
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao consultar estatísticas gerais', error);
      throw error;
    }
  }

  async getScoreRiscoEvasao(filters: RiscoEvasaoDto) {
    try {
      const query = getScoreRiscoEvasaoQuery(filters);
      this.logger.debug(
        `Executando score risco evasão com filtro: ${filters.nivelRiscoMinimo}`,
      );
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao consultar score risco evasão', error);
      throw error;
    }
  }

  async getCustoRescisaoReal(filters: CustoRescisaoDto) {
    try {
      const query = getCustoRescisaoRealQuery(filters);
      this.logger.debug(
        `Executando custo rescisão real: ${JSON.stringify(filters)}`,
      );
      return await this.databaseService.executeSQL(query, []);
    } catch (error) {
      this.logger.error('Erro ao consultar custo rescisão real', error);
      throw error;
    }
  }

  validateFilters(filters: RhFiltersDto): { valid: boolean; error?: string } {
    const turnFilters = filters as TurnoverFilters;
    return TurnoverQueryBuilder.validateFilters(turnFilters);
  }
}
