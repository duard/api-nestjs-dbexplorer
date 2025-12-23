import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

// Taxa de Sobrevivência - Análise de retenção nos primeiros meses
export const getTaxaSobrevivenciaQuery = (filters: TurnoverFilters = {}): string => {
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'F', dept: 'D', cargo: 'C', emp: 'EMP' },
    { admissao: 'F.DTADM', demissao: 'F.DTDEM' }
  );

  const { dataInicio, dataFim } = TurnoverQueryBuilder.getDateRange(filters);

  return `
WITH ADMITIDOS_RECENTES AS (
    SELECT 
        F.CODFUNC,
        F.DTADM,
        F.DTDEM,
        CASE 
            WHEN F.DTDEM IS NULL THEN DATEDIFF(DAY, F.DTADM, GETDATE())
            ELSE DATEDIFF(DAY, F.DTADM, F.DTDEM)
        END AS DIAS_PERMANENCIA,
        CASE WHEN F.DTDEM IS NULL THEN 1 ELSE 0 END AS AINDA_ATIVO
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}'
      ${whereClause}
)
SELECT 
    '0-30 dias' AS PERIODO,
    30 AS DIAS,
    COUNT(*) AS TOTAL_ADMITIDOS,
    SUM(CASE WHEN DIAS_PERMANENCIA >= 30 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) AS PERMANECERAM,
    CAST(
        SUM(CASE WHEN DIAS_PERMANENCIA >= 30 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) * 100.0 / 
        COUNT(*)
        AS DECIMAL(5,2)
    ) AS TAXA_SOBREVIVENCIA
FROM ADMITIDOS_RECENTES

UNION ALL

SELECT 
    '31-60 dias' AS PERIODO,
    60 AS DIAS,
    COUNT(*) AS TOTAL_ADMITIDOS,
    SUM(CASE WHEN DIAS_PERMANENCIA >= 60 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) AS PERMANECERAM,
    CAST(
        SUM(CASE WHEN DIAS_PERMANENCIA >= 60 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) * 100.0 / 
        COUNT(*)
        AS DECIMAL(5,2)
    ) AS TAXA_SOBREVIVENCIA
FROM ADMITIDOS_RECENTES

UNION ALL

SELECT 
    '61-90 dias' AS PERIODO,
    90 AS DIAS,
    COUNT(*) AS TOTAL_ADMITIDOS,
    SUM(CASE WHEN DIAS_PERMANENCIA >= 90 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) AS PERMANECERAM,
    CAST(
        SUM(CASE WHEN DIAS_PERMANENCIA >= 90 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) * 100.0 / 
        COUNT(*)
        AS DECIMAL(5,2)
    ) AS TAXA_SOBREVIVENCIA
FROM ADMITIDOS_RECENTES

UNION ALL

SELECT 
    '91-180 dias' AS PERIODO,
    180 AS DIAS,
    COUNT(*) AS TOTAL_ADMITIDOS,
    SUM(CASE WHEN DIAS_PERMANENCIA >= 180 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) AS PERMANECERAM,
    CAST(
        SUM(CASE WHEN DIAS_PERMANENCIA >= 180 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) * 100.0 / 
        COUNT(*)
        AS DECIMAL(5,2)
    ) AS TAXA_SOBREVIVENCIA
FROM ADMITIDOS_RECENTES

UNION ALL

SELECT 
    '181-365 dias' AS PERIODO,
    365 AS DIAS,
    COUNT(*) AS TOTAL_ADMITIDOS,
    SUM(CASE WHEN DIAS_PERMANENCIA >= 365 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) AS PERMANECERAM,
    CAST(
        SUM(CASE WHEN DIAS_PERMANENCIA >= 365 OR AINDA_ATIVO = 1 THEN 1 ELSE 0 END) * 100.0 / 
        COUNT(*)
        AS DECIMAL(5,2)
    ) AS TAXA_SOBREVIVENCIA
FROM ADMITIDOS_RECENTES

ORDER BY DIAS
`;
};
