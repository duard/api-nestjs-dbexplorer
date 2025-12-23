import {
  TurnoverFilters,
  TurnoverQueryBuilder,
} from '../interfaces/turnover-filters.interface';

/**
 * Custos Reais de Rescisão - TFPBAS (Folha de Pagamento)
 * Retorna valores reais pagos em rescisões com filtros avançados
 */
export const getCustoRescisaoRealQuery = (
  filters: TurnoverFilters = {},
): string => {
  // Valida filtros
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Constrói WHERE dinâmico
  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'FUN', dept: 'DEP', cargo: 'CAR', emp: 'EMP' },
    { demissao: 'FUN.DTDEM' }, // Filtrar por data de demissão
  );

  // Período padrão: últimos 2 anos

  const periodoBase = filters.dataInicio
    ? ``
    : `AND BAS.DTPAGAMENTO >= DATEADD(YEAR, -2, GETDATE())`;

  return `
SELECT 
    YEAR(BAS.DTPAGAMENTO) AS ANO,
    MONTH(BAS.DTPAGAMENTO) AS MES,
    DATENAME(MONTH, BAS.DTPAGAMENTO) AS MES_NOME,
    
    -- Dados da Empresa
    BAS.CODEMP,
    CONCAT(RIGHT('000'+ CAST(EMP.CODEMP AS VARCHAR(3)), 3), ' - ', RTRIM(LTRIM(EMP.NOMEFANTASIA))) AS EMPRESA,
    
    -- Dados do Funcionário
    BAS.CODFUNC,
    CONCAT(RIGHT('000000' + CAST(FUN.CODFUNC AS VARCHAR(6)), 6), ' - ', RTRIM(LTRIM(FUN.NOMEFUNC))) AS FUNCIONARIO,
    RTRIM(LTRIM(FUN.CPF)) AS CPF,
    
    -- Dados do Departamento
    RTRIM(LTRIM(DEP.DESCRDEP)) AS DEPARTAMENTO,
    
    -- Dados do Cargo
    RTRIM(LTRIM(CAR.DESCRCARGO)) AS CARGO,
    
    -- Dados da Rescisão
    BAS.SALBASE AS SALARIO_BASE,
    BAS.SALBRUTO AS SALARIO_BRUTO_RESCISAO,
    BAS.SALLIQ AS VALOR_LIQUIDO_PAGO,
    BAS.DTPAGAMENTO AS DATA_PAGAMENTO,
    
    -- Status da Folha
    CASE
        WHEN BAS.STATUS = 1 THEN 'Folha Fechada'
        WHEN BAS.STATUS = 4 THEN 'Conferida/Confirmada'
        WHEN BAS.STATUS = 5 THEN 'Pronto para integração Contábil'
        ELSE 'Outro Status'
    END AS STATUS_FOLHA,
    
    -- Solicitante/Responsável
    CONCAT(RIGHT('000000' + CAST(USU.CODUSU AS VARCHAR(6)), 6), ' - ', RTRIM(LTRIM(USU.NOMEUSU))) AS RESPONSAVEL,
    
    -- Datas e Tempo
    FUN.DTADM AS DATA_ADMISSAO,
    FUN.DTDEM AS DATA_DEMISSAO,
    DATEDIFF(DAY, FUN.DTADM, FUN.DTDEM) AS DIAS_NA_EMPRESA

FROM 
    TFPBAS BAS
    JOIN TFPFUN FUN ON FUN.CODFUNC = BAS.CODFUNC AND FUN.CODEMP = BAS.CODEMP
    JOIN TSIUSU USU ON USU.CODUSU = BAS.CODUSU
    JOIN TFPCAR CAR ON CAR.CODCARGO = FUN.CODCARGO
    LEFT JOIN TFPDEP DEP ON DEP.CODDEP = FUN.CODDEP
    JOIN TSIEMP EMP ON EMP.CODEMP = BAS.CODEMP

WHERE 
    BAS.TIPFOLHA = 'R'  -- Apenas folhas de Rescisão
    AND BAS.STATUS IN (1, 4, 5)  -- Apenas folhas fechadas/conferidas
    AND BAS.DTPAGAMENTO IS NOT NULL  -- Apenas rescisões pagas
    ${periodoBase}
    ${whereClause}

ORDER BY 
    BAS.DTPAGAMENTO DESC;
`;
};
