/**
 * Interface para filtros avançados de turnover
 * REGRA IMPORTANTE: codemp e codfunc sempre andam juntos
 */
export interface TurnoverFilters {
  // Período
  dataInicio?: string;
  dataFim?: string;

  // Filtros de Inclusão
  codemp?: string; // CSV: "1,2,3"
  coddep?: string; // CSV: "10,20,30"
  codcargo?: string; // CSV: "100,200"
  codfunc?: string; // CSV: "123,456" - REQUER codemp

  // Filtros de Exclusão
  ignorarEmpresas?: string; // CSV: "1,2,3"
  ignorarDepartamentos?: string; // CSV: "10,20,30"
  ignorarFuncionarios?: string; // CSV: "100,200" - REQUER codemp
  ignorarCargos?: string; // CSV: "100,200"

  // Agrupamento
  agruparPor?: 'mes' | 'departamento' | 'cargo' | 'empresa' | 'nenhum';
}

/**
 * Helper para construir cláusulas WHERE SQL dinâmicas
 */
export class TurnoverQueryBuilder {
  /**
   * Constrói WHERE clause baseado nos filtros
   * @param filters - Filtros aplicados
   * @param tableAliases - Mapeamento de aliases: { func: 'F', dept: 'D', cargo: 'C', emp: 'E' }
   * @param dateFields - Campos de data para filtrar: { admissao: 'F.DTADM', demissao: 'F.DTDEM' }
   */
  static buildWhereClause(
    filters: TurnoverFilters,
    tableAliases: {
      func?: string;
      dept?: string;
      cargo?: string;
      emp?: string;
    } = {},
    dateFields: { admissao?: string; demissao?: string } = {},
  ): string {
    const conditions: string[] = [];
    const { func = 'FUN' } = tableAliases;

    // Filtro de Período (demissões)
    if (filters.dataInicio && dateFields.demissao) {
      conditions.push(`${dateFields.demissao} >= '${filters.dataInicio}'`);
    }
    if (filters.dataFim && dateFields.demissao) {
      conditions.push(`${dateFields.demissao} <= '${filters.dataFim}'`);
    }

    // Filtro de Período (admissões)
    if (filters.dataInicio && dateFields.admissao && !dateFields.demissao) {
      conditions.push(`${dateFields.admissao} >= '${filters.dataInicio}'`);
    }
    if (filters.dataFim && dateFields.admissao && !dateFields.demissao) {
      conditions.push(`${dateFields.admissao} <= '${filters.dataFim}'`);
    }

    // Filtro de Empresa (INCLUSÃO)
    if (filters.codemp) {
      const empresas = filters.codemp.split(',').map((c) => c.trim());
      conditions.push(`${func}.CODEMP IN (${empresas.join(',')})`);
    }

    // Filtro de Departamento (INCLUSÃO por código)
    if (filters.coddep) {
      const deps = filters.coddep.split(',').map((d) => d.trim());
      conditions.push(`${func}.CODDEP IN (${deps.join(',')})`);
    }

    // Filtro de Cargo (INCLUSÃO por código)
    if (filters.codcargo) {
      const cargos = filters.codcargo.split(',').map((c) => c.trim());
      conditions.push(`${func}.CODCARGO IN (${cargos.join(',')})`);
    }

    // Filtro de Funcionário (INCLUSÃO) - REQUER codemp
    if (filters.codfunc && filters.codemp) {
      const funcionarios = filters.codfunc.split(',').map((f) => f.trim());
      const empresas = filters.codemp.split(',').map((e) => e.trim());

      // Garante que codemp e codfunc andam juntos
      const pares = funcionarios
        .map((codfunc) =>
          empresas.map(
            (codemp) =>
              `(${func}.CODEMP = ${codemp} AND ${func}.CODFUNC = ${codfunc})`,
          ),
        )
        .flat();

      conditions.push(`(${pares.join(' OR ')})`);
    }

    // Filtro de EXCLUSÃO - Funcionários
    if (filters.ignorarFuncionarios && filters.codemp) {
      const funcionarios = filters.ignorarFuncionarios
        .split(',')
        .map((f) => f.trim());
      const empresas = filters.codemp.split(',').map((e) => e.trim());

      const pares = funcionarios
        .map((codfunc) =>
          empresas.map(
            (codemp) =>
              `(${func}.CODEMP = ${codemp} AND ${func}.CODFUNC = ${codfunc})`,
          ),
        )
        .flat();

      conditions.push(`NOT (${pares.join(' OR ')})`);
    }

    // Filtro de EXCLUSÃO - Empresas
    if (filters.ignorarEmpresas) {
      const empresas = filters.ignorarEmpresas.split(',').map((e) => e.trim());
      conditions.push(`${func}.CODEMP NOT IN (${empresas.join(',')})`);
    }

    // Filtro de EXCLUSÃO - Departamentos
    if (filters.ignorarDepartamentos) {
      const deps = filters.ignorarDepartamentos.split(',').map((d) => d.trim());
      conditions.push(`${func}.CODDEP NOT IN (${deps.join(',')})`);
    }

    // Filtro de EXCLUSÃO - Cargos
    if (filters.ignorarCargos) {
      const cargos = filters.ignorarCargos.split(',').map((c) => c.trim());
      conditions.push(`${func}.CODCARGO NOT IN (${cargos.join(',')})`);
    }

    return conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';
  }

  /**
   * Extrai datas com fallback para período padrão
   */
  static getDateRange(filters: TurnoverFilters): {
    dataInicio: string;
    dataFim: string;
  } {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();

    return {
      dataInicio: filters.dataInicio || `${anoAtual}-01-01`,
      dataFim: filters.dataFim || hoje.toISOString().split('T')[0],
    };
  }

  /**
   * Valida que codfunc não seja usado sem codemp
   */
  static validateFilters(filters: TurnoverFilters): {
    valid: boolean;
    error?: string;
  } {
    if (filters.codfunc && !filters.codemp) {
      return {
        valid: false,
        error:
          'Parâmetro "codfunc" requer "codemp". codemp e codfunc sempre andam juntos.',
      };
    }

    if (filters.ignorarFuncionarios && !filters.codemp) {
      return {
        valid: false,
        error:
          'Parâmetro "ignorarFuncionarios" requer "codemp". codemp e codfunc sempre andam juntos.',
      };
    }

    return { valid: true };
  }
}
