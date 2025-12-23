import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

export const getCustoTurnoverQuery = (filters: TurnoverFilters = {}): string => {
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
    F.SALBASE AS SALARIO_MENSAL,
    F.DTADM,
    F.DTDEM,
    DATEDIFF(DAY, F.DTADM, F.DTDEM) AS DIAS_EMPRESA,
    CAST(F.SALBASE * 2.5 AS DECIMAL(10, 2)) AS CUSTO_ESTIMADO_SUBSTITUICAO
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
  ${whereClause}
ORDER BY F.DTDEM DESC
`;
};

export const getTurnoverVoluntarioInvoluntarioQuery = `
SELECT 
    FORMAT(F.DTDEM, 'yyyy-MM') AS ANO_MES,
    RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
    'Não Disponível' AS TIPO,
    COUNT(*) AS TOTAL
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
WHERE F.DTDEM BETWEEN @dataInicio AND @dataFim
GROUP BY FORMAT(F.DTDEM, 'yyyy-MM'), D.DESCRDEP
ORDER BY ANO_MES DESC, DEPARTAMENTO
`;

export const getTaxaDesligamentosPorMotivosQuery = (filters: TurnoverFilters = {}): string => {
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
    'N/A' AS CODIGO_MOTIVO,
    'Informação de motivo de demissão não disponível no sistema' AS MOTIVO,
    COUNT(*) AS TOTAL_DESLIGAMENTOS,
    CAST(100.0 AS DECIMAL(5,2)) AS PERCENTUAL
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
WHERE F.DTDEM BETWEEN '${dataInicio}' AND '${dataFim}'
  ${whereClause}
`;
};

export const getTaxaSaudavelPorDepartamentoQuery = `
WITH DADOS_DEPARTAMENTO AS (
    SELECT 
        RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
        COUNT(DISTINCT F.CODFUNC) AS TOTAL_FUNC,
        COUNT(DISTINCT CASE WHEN F.DTDEM BETWEEN @dataInicio AND @dataFim THEN F.CODFUNC END) AS DESLIGAMENTOS,
        CASE 
            WHEN COUNT(DISTINCT F.CODFUNC) > 0 
            THEN CAST(COUNT(DISTINCT CASE WHEN F.DTDEM BETWEEN @dataInicio AND @dataFim THEN F.CODFUNC END) * 100.0 / COUNT(DISTINCT F.CODFUNC) AS DECIMAL(5,2))
            ELSE 0 
        END AS TAXA_TURNOVER,
        CASE 
            WHEN CAST(COUNT(DISTINCT CASE WHEN F.DTDEM BETWEEN @dataInicio AND @dataFim THEN F.CODFUNC END) * 100.0 / COUNT(DISTINCT F.CODFUNC) AS DECIMAL(5,2)) <= 10 THEN 'Excelente'
            WHEN CAST(COUNT(DISTINCT CASE WHEN F.DTDEM BETWEEN @dataInicio AND @dataFim THEN F.CODFUNC END) * 100.0 / COUNT(DISTINCT F.CODFUNC) AS DECIMAL(5,2)) <= 20 THEN 'Normal'
            WHEN CAST(COUNT(DISTINCT CASE WHEN F.DTDEM BETWEEN @dataInicio AND @dataFim THEN F.CODFUNC END) * 100.0 / COUNT(DISTINCT F.CODFUNC) AS DECIMAL(5,2)) <= 40 THEN 'Atenção'
            ELSE 'Crítico'
        END AS CLASSIFICACAO
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    WHERE F.SITUACAO IN ('0', '1')
    GROUP BY D.DESCRDEP
)
SELECT * FROM DADOS_DEPARTAMENTO
ORDER BY TAXA_TURNOVER DESC
`;

export const getProducaoTalentosAltasQuery = `
SELECT TOP 10
    F.CODFUNC,
    F.CODEMP,
    RTRIM(LTRIM(F.NOMEFUNC)) AS NOME,
    RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
    RTRIM(LTRIM(C.DESCRCARGO)) AS CARGO,
    F.DTADM,
    DATEDIFF(YEAR, F.DTADM, GETDATE()) AS ANOS_EMPRESA,
    'Talento de Alto Desempenho' AS CATEGORIA
FROM TFPFUN F
LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
WHERE F.SITUACAO = '1'
  AND DATEDIFF(YEAR, F.DTADM, GETDATE()) >= 3
ORDER BY DATEDIFF(YEAR, F.DTADM, GETDATE()) DESC, F.NOMEFUNC
`;

export const getTaxaRetencaoQuery = `
WITH CTES AS (
    SELECT 
        COUNT(DISTINCT CASE WHEN F.DTADM BETWEEN DATEADD(YEAR, -1, @dataFim) AND @dataFim AND F.DTDEM IS NULL THEN F.CODFUNC END) AS ADMITIDOS_RETIDOS,
        COUNT(DISTINCT CASE WHEN F.DTADM BETWEEN DATEADD(YEAR, -1, @dataFim) AND @dataFim THEN F.CODFUNC END) AS TOTAL_ADMITIDOS
    FROM TFPFUN F
)
SELECT 
    ADMITIDOS_RETIDOS,
    TOTAL_ADMITIDOS,
    CASE 
        WHEN TOTAL_ADMITIDOS > 0 
        THEN CAST(ADMITIDOS_RETIDOS * 100.0 / TOTAL_ADMITIDOS AS DECIMAL(5,2))
        ELSE 0 
    END AS TAXA_RETENCAO_PERCENTUAL,
    'Taxa de retenção de novos colaboradores (últimos 12 meses)' AS DESCRICAO
FROM CTES
`;
