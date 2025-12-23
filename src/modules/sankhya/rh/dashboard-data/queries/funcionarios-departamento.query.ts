import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

/**
 * Funcionários por Departamento e Cargo com filtros avançados
 */
export const getFuncionariosPorDepartamentoQuery = (filters: TurnoverFilters = {}): string => {
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
    RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
    RTRIM(LTRIM(C.DESCRCARGO)) AS CARGO,
    COUNT(*) AS TOTAL_ATIVOS
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.SITUACAO = '1'
  ${whereClause}
GROUP BY 
    RTRIM(LTRIM(D.DESCRDEP)), RTRIM(LTRIM(C.DESCRCARGO))
ORDER BY 
    RTRIM(LTRIM(D.DESCRDEP)), RTRIM(LTRIM(C.DESCRCARGO))
`;
};
