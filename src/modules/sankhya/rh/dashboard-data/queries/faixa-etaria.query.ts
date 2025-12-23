import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getFaixaEtariaQuery = (filters: TurnoverFilters = {}): string => {
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'F', dept: 'D', cargo: 'C', emp: 'EMP' },
    {}
  );

  return `
SELECT 
    CASE
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) < 20 THEN 'Menos de 20'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 20 AND 29 THEN '20-29'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 30 AND 39 THEN '30-39'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 40 AND 49 THEN '40-49'
        ELSE '50+'
    END AS FAIXA_ETARIA,
    COUNT(*) AS TOTAL
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.SITUACAO = '1'
  ${whereClause}
GROUP BY
    CASE
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) < 20 THEN 'Menos de 20'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 20 AND 29 THEN '20-29'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 30 AND 39 THEN '30-39'
        WHEN DATEDIFF(YEAR, F.DTNASC, GETDATE()) BETWEEN 40 AND 49 THEN '40-49'
        ELSE '50+'
    END
ORDER BY TOTAL DESC
`;
};
