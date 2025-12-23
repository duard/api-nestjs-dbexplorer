import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

// Saldo Líquido - Evolução mensal do headcount
export const getSaldoLiquidoQuery = (filters: TurnoverFilters = {}): string => {
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'F', dept: 'D', cargo: 'C', emp: 'EMP' },
    {}
  );

  const { dataInicio, dataFim } = TurnoverQueryBuilder.getDateRange(filters);

  return `
WITH MESES AS (
    SELECT DISTINCT 
        FORMAT(F.DTADM, 'yyyy-MM') AS MES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}'
      ${whereClause}
    
    UNION
    
    SELECT DISTINCT 
        FORMAT(F.DTDEM, 'yyyy-MM') AS MES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
      AND F.DTDEM IS NOT NULL
      ${whereClause}
),
ADMISSOES AS (
    SELECT 
        FORMAT(F.DTADM, 'yyyy-MM') AS MES,
        COUNT(*) AS TOTAL_ADMISSOES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}'
      ${whereClause}
    GROUP BY FORMAT(F.DTADM, 'yyyy-MM')
),
DEMISSOES AS (
    SELECT 
        FORMAT(F.DTDEM, 'yyyy-MM') AS MES,
        COUNT(*) AS TOTAL_DEMISSOES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
      AND F.DTDEM IS NOT NULL
      ${whereClause}
    GROUP BY FORMAT(F.DTDEM, 'yyyy-MM')
),
HEADCOUNT_INICIAL AS (
    SELECT COUNT(*) AS TOTAL
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE (F.DTADM < '${dataInicio}' OR F.DTADM IS NULL)
      AND (F.DTDEM IS NULL OR F.DTDEM >= '${dataInicio}')
      ${whereClause}
)
SELECT 
    M.MES,
    COALESCE(A.TOTAL_ADMISSOES, 0) AS ADMISSOES,
    COALESCE(D.TOTAL_DEMISSOES, 0) AS DEMISSOES,
    COALESCE(A.TOTAL_ADMISSOES, 0) - COALESCE(D.TOTAL_DEMISSOES, 0) AS SALDO_LIQUIDO,
    (
        SELECT HI.TOTAL 
        FROM HEADCOUNT_INICIAL HI
    ) + (
        SELECT SUM(
            COALESCE(A2.TOTAL_ADMISSOES, 0) - COALESCE(D2.TOTAL_DEMISSOES, 0)
        )
        FROM MESES M2
        LEFT JOIN ADMISSOES A2 ON M2.MES = A2.MES
        LEFT JOIN DEMISSOES D2 ON M2.MES = D2.MES
        WHERE M2.MES <= M.MES
    ) AS HEADCOUNT_ACUMULADO
FROM MESES M
LEFT JOIN ADMISSOES A ON M.MES = A.MES
LEFT JOIN DEMISSOES D ON M.MES = D.MES
ORDER BY M.MES
`;
};
