import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getResumoTurnoverDepartamentoQuery = (filters: TurnoverFilters = {}): string => {
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
WITH ULTIMOS_DADOS AS (
    SELECT 
        RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
        COUNT(*) AS TOTAL_FUNCIONARIOS,
        SUM(CASE WHEN F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}' THEN 1 ELSE 0 END) AS ADMISSOES_MES,
        SUM(CASE WHEN F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}' AND F.DTDEM IS NOT NULL THEN 1 ELSE 0 END) AS DEMISSOES_MES
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.SITUACAO IN ('0', '1')
      ${whereClause}
    GROUP BY D.DESCRDEP
)
SELECT 
    DEPARTAMENTO,
    TOTAL_FUNCIONARIOS,
    ADMISSOES_MES,
    DEMISSOES_MES,
    CASE 
        WHEN TOTAL_FUNCIONARIOS > 0 
        THEN CAST(DEMISSOES_MES * 100.0 / TOTAL_FUNCIONARIOS AS DECIMAL(10,2))
        ELSE 0 
    END AS TURNOVER_PERCENTUAL
FROM ULTIMOS_DADOS
ORDER BY TURNOVER_PERCENTUAL DESC
`;
};
