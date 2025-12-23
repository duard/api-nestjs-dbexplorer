import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getTempoEmpresaQuery = (filters: TurnoverFilters = {}): string => {
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
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) < 1 THEN '0-1 ano'
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) BETWEEN 1 AND 3 THEN '1-3 anos'
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) BETWEEN 3 AND 5 THEN '3-5 anos'
        ELSE '5+ anos'
    END AS FAIXA_TEMPO_CASA,
    COUNT(*) AS TOTAL
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.SITUACAO = '1'
  ${whereClause}
GROUP BY 
    CASE 
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) < 1 THEN '0-1 ano'
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) BETWEEN 1 AND 3 THEN '1-3 anos'
        WHEN DATEDIFF(YEAR, F.DTADM, GETDATE()) BETWEEN 3 AND 5 THEN '3-5 anos'
        ELSE '5+ anos'
    END
ORDER BY TOTAL DESC
`;
};
