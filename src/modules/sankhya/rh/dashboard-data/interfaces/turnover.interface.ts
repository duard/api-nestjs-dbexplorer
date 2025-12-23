/**
 * Interface para Funcionários por Departamento/Cargo
 */
export interface FuncionarioDepartamento {
  DEPARTAMENTO: string;
  CARGO: string;
  TOTAL_ATIVOS: number;
}

/**
 * Interface para dados de Turnover
 */
export interface TurnoverData {
  ANO_MES: string;
  DEPARTAMENTO: string;
  SETOR: string;
  CARGO: string;
  ADMISSOES: number;
  DEMISSOES: number;
  TURNOVER: number;
}

/**
 * Interface para Faixa de Tempo de Empresa
 */
export interface TempoEmpresa {
  FAIXA_TEMPO_CASA: string;
  TOTAL: number;
}

/**
 * Interface para Faixa Etária
 */
export interface FaixaEtaria {
  FAIXA_ETARIA: string;
  TOTAL: number;
}

/**
 * Interface para resumo de Turnover por Departamento
 */
export interface ResumoTurnoverDepartamento {
  DEPARTAMENTO: string;
  TOTAL_FUNCIONARIOS: number;
  ADMISSOES_MES: number;
  DEMISSOES_MES: number;
  TURNOVER_PERCENTUAL: number;
}

/**
 * Interface para resumo de Turnover por Período
 */
export interface ResumoTurnoverPeriodo {
  ANO_MES: string;
  TOTAL_ADMISSOES: number;
  TOTAL_DEMISSOES: number;
  TURNOVER_MEDIO: number;
}

/**
 * Interface para análise de desligamentos
 */
export interface AnaliseDesligamento {
  CODEMP: number;
  CODFUNC: number;
  NOME: string;
  DEPARTAMENTO: string;
  CARGO: string;
  DTADM: Date;
  DTDEM: Date;
  TEMPO_EMPRESA_DIAS: number;
}

/**
 * Interface para estatísticas gerais
 */
export interface EstatisticasGerais {
  TOTAL_FUNCIONARIOS_ATIVOS: number;
  TOTAL_DESLIGADOS_PERIODO: number;
  ADMISSOES_PERIODO: number;
  TURNOVER_MEDIO_PERCENTUAL: number;
  FAIXA_ETARIA_MEDIA: string;
  TEMPO_CASA_MEDIO: string;
}

/**
 * Interface para Turnover Voluntário/Involuntário
 */
export interface TurnoverVoluntarioInvoluntario {
  ANO_MES: string;
  DEPARTAMENTO: string;
  TIPO: 'Voluntário' | 'Involuntário';
  TOTAL: number;
}

/**
 * Interface para Custo de Turnover
 */
export interface CustoTurnover {
  CODEMP: number;
  CODFUNC: number;
  NOME: string;
  DEPARTAMENTO: string;
  CARGO: string;
  SALARIO_MENSAL: number;
  DTADM: Date;
  DTDEM: Date;
  DIAS_EMPRESA: number;
  CUSTO_ESTIMADO_SUBSTITUICAO: number;
}

/**
 * Interface para Motivo de Desligamento
 */
export interface MotivoDesligamento {
  CODIGO_MOTIVO: string;
  MOTIVO: string;
  TOTAL_DESLIGAMENTOS: number;
  PERCENTUAL: number;
}

/**
 * Interface para Taxa de Saúde por Departamento
 */
export interface TaxaSaudeDepartamento {
  DEPARTAMENTO: string;
  TOTAL_FUNC: number;
  DESLIGAMENTOS: number;
  TAXA_TURNOVER: number;
  CLASSIFICACAO: 'Excelente' | 'Normal' | 'Atenção' | 'Crítico';
}

/**
 * Interface para Talentos de Alto Desempenho
 */
export interface TalentoAltoDesempenho {
  CODEMP: number;
  CODFUNC: number;
  NOME: string;
  DEPARTAMENTO: string;
  CARGO: string;
  DTADM: Date;
  ANOS_EMPRESA: number;
  CATEGORIA: string;
}

/**
 * Interface para Taxa de Retenção
 */
export interface TaxaRetencao {
  ADMITIDOS_RETIDOS: number;
  TOTAL_ADMITIDOS: number;
  TAXA_RETENCAO_PERCENTUAL: number;
  DESCRICAO: string;
}

/**
 * Interface para Taxa de Sobrevivência (Survival Rate)
 */
export interface TaxaSobrevivencia {
  PERIODO: string;
  DIAS: number;
  TOTAL_ADMITIDOS: number;
  PERMANECERAM: number;
  TAXA_SOBREVIVENCIA: number;
}

/**
 * Interface para Saldo Líquido (Net Headcount)
 */
export interface SaldoLiquido {
  MES: string;
  ADMISSOES: number;
  DEMISSOES: number;
  SALDO_LIQUIDO: number;
  HEADCOUNT_ACUMULADO: number;
}

/**
 * Interface para Sazonalidade de Turnover
 */
export interface Sazonalidade {
  MES_NUMERO: number;
  MES_NOME: string;
  MEDIA_DEMISSOES: number;
  MIN_DEMISSOES: number;
  MAX_DEMISSOES: number;
  DESVIO_PADRAO: number;
  ANOS_ANALISADOS: number;
}

/**
 * Interface para Score de Risco de Evasão
 */
export interface ScoreRiscoEvasao {
  CODEMP: number;
  CODFUNC: number;
  NOME: string;
  DEPARTAMENTO: string;
  CARGO: string;
  DTADM: Date;
  MESES_EMPRESA: number;
  SALBASE: number;
  RISCO_TEMPO_CASA: number;
  RISCO_SALARIO: number;
  RISCO_SEM_AUMENTO: number;
  RISCO_DEPARTAMENTO: number;
  SCORE_RISCO_TOTAL: number;
  NIVEL_RISCO: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
}

/**
 * Interface para Dashboard Executivo
 */
export interface DashboardExecutivo {
  HEADCOUNT_ATUAL: number;
  HEADCOUNT_VARIACAO_MES: number;
  HEADCOUNT_VARIACAO_PERCENTUAL: number;
  TURNOVER_TAXA_MES: number;
  TURNOVER_TAXA_ANO: number;
  TURNOVER_META: number;
  TURNOVER_STATUS: 'ACIMA_META' | 'DENTRO_META';
  CUSTO_MES_ATUAL: number;
  CUSTO_ANO_ACUMULADO: number;
  CUSTO_PROJECAO_ANO: number;
  ADMISSOES_MES: number;
  ADMISSOES_MEDIA_MENSAL: number;
  ADMISSOES_TEMPO_MEDIO_DIAS: number;
  DEMISSOES_MES: number;
  DEMISSOES_VOLUNTARIAS: number;
  DEMISSOES_INVOLUNTARIAS: number;
  FUNCIONARIOS_ALTO_RISCO: number;
  DEPARTAMENTOS_CRITICOS: number;
  DATA_ATUALIZACAO: Date;
}

/**
 * Interface para Custo Real de Rescisão (TFPBAS)
 */
export interface CustoRescisaoReal {
  CODEMP: number;
  CODFUNC: number;
  ANO: number;
  MES: number;
  MES_NOME: string;
  EMPRESA: string;
  FUNCIONARIO: string;
  CPF: string;
  CARGO: string;
  SALARIO_BASE: number;
  SALARIO_BRUTO_RESCISAO: number;
  VALOR_LIQUIDO_PAGO: number;
  DATA_PAGAMENTO: Date;
  STATUS_FOLHA: string;
  RESPONSAVEL: string;
  DIAS_NA_EMPRESA: number;
  DATA_ADMISSAO: Date;
  DATA_DEMISSAO: Date;
}

/**
 * Interface para Pipeline de Desligamentos (TFPREQ)
 */
export interface PipelineDesligamento {
  ID_REQUISICAO: number;
  DATA_CRIACAO: Date;
  DATA_LIMITE: Date;
  STATUS_CODIGO: number;
  STATUS_DESCRICAO: string;
  DIAS_RESTANTES: number;
  PRIORIDADE: 'CONCLUÍDO' | 'ATRASADO' | 'VENCE HOJE' | 'URGENTE' | 'NO PRAZO';
  TIPO_REQUISICAO: string;
  CODEMP: number;
  EMPRESA: string;
  CODFUNC: number;
  FUNCIONARIO: string;
  CPF: string;
  CARGO: string;
  SOLICITANTE: string;
  OBSERVACAO: string;
  DIAS_NA_EMPRESA: number;
  DATA_ADMISSAO: Date;
}
