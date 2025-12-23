import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

/**
 * Análise de Desligamentos com filtros avançados
 */
export const getAnaliseDesligamentosQuery = (filters: TurnoverFilters = {}): string => {
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
SELECT 
    F.CODFUNC,
    F.CODEMP,
    RTRIM(LTRIM(F.NOMEFUNC)) AS NOME,
    RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
    RTRIM(LTRIM(C.DESCRCARGO)) AS CARGO,
    F.DTADM,
    F.DTDEM,
    DATEDIFF(DAY, F.DTADM, F.DTDEM) AS TEMPO_EMPRESA_DIAS
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.DTDEM IS NOT NULL
  AND F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
  ${whereClause}
ORDER BY F.DTDEM DESC
`;
};
