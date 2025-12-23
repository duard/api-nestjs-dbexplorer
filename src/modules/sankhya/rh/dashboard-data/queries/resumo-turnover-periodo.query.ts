import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getResumoTurnoverPeriodoQuery = (filters: TurnoverFilters = {}): string => {
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
WITH AD_PERIODO AS (
    SELECT 
        FORMAT(F.DTADM, 'yyyy-MM') AS ANO_MES,
        COUNT(*) AS TOTAL_ADMISSOES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}'
      ${whereClause}
    GROUP BY FORMAT(F.DTADM, 'yyyy-MM')
),
DEM_PERIODO AS (
    SELECT 
        FORMAT(F.DTDEM, 'yyyy-MM') AS ANO_MES,
        COUNT(*) AS TOTAL_DEMISSOES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTDEM IS NOT NULL
      AND F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
      ${whereClause}
    GROUP BY FORMAT(F.DTDEM, 'yyyy-MM')
),
TOTAL_FUNCIONARIOS AS (
    SELECT 
        COUNT(*) AS TOTAL
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.SITUACAO = '1'
      ${whereClause}
)
SELECT
    COALESCE(A.ANO_MES, D.ANO_MES) AS ANO_MES,
    COALESCE(A.TOTAL_ADMISSOES, 0) AS TOTAL_ADMISSOES,
    COALESCE(D.TOTAL_DEMISSOES, 0) AS TOTAL_DEMISSOES,
    CASE 
        WHEN T.TOTAL > 0 
        THEN CAST(COALESCE(D.TOTAL_DEMISSOES, 0) * 100.0 / T.TOTAL AS DECIMAL(10,2))
        ELSE 0 
    END AS TURNOVER_MEDIO
FROM AD_PERIODO A
FULL JOIN DEM_PERIODO D ON A.ANO_MES = D.ANO_MES
CROSS JOIN TOTAL_FUNCIONARIOS T
ORDER BY ANO_MES DESC
`;
};
