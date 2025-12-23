import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getEstatisticasGeraisQuery = (filters: TurnoverFilters = {}): string => {
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
SELECT 
    (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.SITUACAO = '1' ${whereClause}) AS TOTAL_FUNCIONARIOS_ATIVOS,
    (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.DTDEM IS NOT NULL AND F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}' ${whereClause}) AS TOTAL_DESLIGADOS_PERIODO,
    (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.DTADM BETWEEN '${dataInicio}' AND '${dataFim}' ${whereClause}) AS ADMISSOES_PERIODO,
    CASE 
        WHEN (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.SITUACAO = '1' ${whereClause}) > 0
        THEN CAST(
            (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.DTDEM IS NOT NULL AND F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}' ${whereClause}) * 100.0 / 
            (SELECT COUNT(*) FROM TFPFUN F LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP WHERE F.SITUACAO = '1' ${whereClause})
            AS DECIMAL(10,2)
        )
        ELSE 0
    END AS TURNOVER_MEDIO_PERCENTUAL
`;
};
