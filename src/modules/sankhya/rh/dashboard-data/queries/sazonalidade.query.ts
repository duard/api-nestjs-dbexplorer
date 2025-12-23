import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

// Sazonalidade de Turnover - Padrões mensais ao longo dos anos
export const getSazonalidadeTurnoverQuery = (filters: TurnoverFilters = {}): string => {
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'F', dept: 'D', cargo: 'C', emp: 'EMP' },
    { demissao: 'F.DTDEM' }
  );

  const { dataInicio, dataFim } = TurnoverQueryBuilder.getDateRange(filters);

  return `
WITH DESLIGAMENTOS_POR_MES AS (
    SELECT 
        MONTH(F.DTDEM) AS MES_NUMERO,
        DATENAME(MONTH, F.DTDEM) AS MES_NOME,
        YEAR(F.DTDEM) AS ANO,
        COUNT(*) AS TOTAL_DEMISSOES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
      AND F.DTDEM IS NOT NULL
      ${whereClause}
    GROUP BY 
        MONTH(F.DTDEM),
        DATENAME(MONTH, F.DTDEM),
        YEAR(F.DTDEM)
)
SELECT 
    MES_NUMERO,
    RTRIM(LTRIM(MES_NOME)) AS MES_NOME,
    AVG(CAST(TOTAL_DEMISSOES AS FLOAT)) AS MEDIA_DEMISSOES,
    MIN(TOTAL_DEMISSOES) AS MIN_DEMISSOES,
    MAX(TOTAL_DEMISSOES) AS MAX_DEMISSOES,
    STDEV(CAST(TOTAL_DEMISSOES AS FLOAT)) AS DESVIO_PADRAO,
    COUNT(DISTINCT ANO) AS ANOS_ANALISADOS
FROM DESLIGAMENTOS_POR_MES
GROUP BY 
    MES_NUMERO,
    MES_NOME
ORDER BY MES_NUMERO
`;
};
