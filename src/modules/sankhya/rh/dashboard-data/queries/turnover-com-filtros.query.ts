import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getTurnoverComFiltrosQuery = (filters: TurnoverFilters = {}): string => {
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
WITH BASE AS (
    SELECT 
        F.CODFUNC,
        F.DTADM,
        F.DTDEM,
        RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
        RTRIM(LTRIM(C.DESCRCARGO)) AS CARGO
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE 1=1
      ${whereClause}
),
AD AS (
    SELECT 
        FORMAT(DTADM, 'yyyy-MM') AS ANO_MES,
        DEPARTAMENTO,
        CARGO,
        COUNT(*) AS ADM
    FROM BASE
    WHERE DTADM BETWEEN '${dataInicio}' AND '${dataFim}'
    GROUP BY FORMAT(DTADM, 'yyyy-MM'), DEPARTAMENTO, CARGO
),
DE AS (
    SELECT 
        FORMAT(DTDEM, 'yyyy-MM') AS ANO_MES,
        DEPARTAMENTO,
        CARGO,
        COUNT(*) AS DEM
    FROM BASE
    WHERE DTDEM IS NOT NULL
      AND DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
    GROUP BY FORMAT(DTDEM, 'yyyy-MM'), DEPARTAMENTO, CARGO
),
TOTAL AS (
    SELECT 
        DEPARTAMENTO, CARGO,
        COUNT(*) AS TOTAL_ATUAIS
    FROM BASE
    WHERE DTDEM IS NULL
    GROUP BY DEPARTAMENTO, CARGO
)
SELECT
    COALESCE(A.ANO_MES, D.ANO_MES) AS ANO_MES,
    COALESCE(A.DEPARTAMENTO, D.DEPARTAMENTO) AS DEPARTAMENTO,
    COALESCE(A.CARGO, D.CARGO) AS CARGO,
    COALESCE(A.ADM, 0) AS ADMISSOES,
    COALESCE(D.DEM, 0) AS DEMISSOES,
    CASE 
        WHEN T.TOTAL_ATUAIS > 0 
        THEN CAST(COALESCE(D.DEM, 0) * 100.0 / T.TOTAL_ATUAIS AS DECIMAL(10,2))
        ELSE 0 
    END AS TURNOVER
FROM AD A
FULL JOIN DE D ON A.ANO_MES = D.ANO_MES 
   AND A.DEPARTAMENTO = D.DEPARTAMENTO
   AND A.CARGO = D.CARGO
LEFT JOIN TOTAL T ON T.DEPARTAMENTO = COALESCE(A.DEPARTAMENTO, D.DEPARTAMENTO)
                   AND T.CARGO = COALESCE(A.CARGO, D.CARGO)
ORDER BY ANO_MES DESC, DEPARTAMENTO, CARGO
`;
};
