import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

/**
 * Pipeline de Desligamentos - Baseado em TFPREQ (Requisições)
 * Mostra requisições de rescisão em andamento e seu status com filtros avançados
 */
export const getPipelineDesligamentosQuery = (filters: TurnoverFilters = {}): string => {
  // Valida filtros
  const validation = TurnoverQueryBuilder.validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Constrói WHERE dinâmico
  const whereClause = TurnoverQueryBuilder.buildWhereClause(
    filters,
    { func: 'FUN', dept: 'DEP', cargo: 'CAR', emp: 'EMP' },
    { admissao: 'FUN.DTADM', demissao: 'FUN.DTDEM' }
  );

  // Período padrão: últimos 6 meses
  const { dataInicio, dataFim } = TurnoverQueryBuilder.getDateRange(filters);
  const periodoBase = filters.dataInicio
    ? ``
    : `AND REQ.DTCRIACAO >= DATEADD(MONTH, -6, GETDATE())`;

  return `
SELECT 
    REQ.ID AS ID_REQUISICAO,
    REQ.DTCRIACAO AS DATA_CRIACAO,
    CAST(DATEADD(DAY, 20, REQ.DTCRIACAO) AS DATE) AS DATA_LIMITE,
    REQ.STATUS AS STATUS_CODIGO,
    
    -- Status Legível
    CASE
        WHEN REQ.STATUS = 0 THEN 'AGUARDANDO AÇÃO'
        WHEN REQ.STATUS = 1 THEN 'AGUARDANDO AÇÃO'
        WHEN REQ.STATUS = 2 THEN 'APROVADO'
        WHEN REQ.STATUS = 3 THEN 'REJEITADO'
        WHEN REQ.STATUS = -2 THEN 'CANCELADO'
        ELSE 'STATUS DESCONHECIDO'
    END AS STATUS_DESCRICAO,
    
    -- Dias Restantes (SLA)
    CASE
        WHEN REQ.STATUS IN (2, 3, -2) THEN 0 
        ELSE DATEDIFF(DAY, GETDATE(), DATEADD(DAY, 20, REQ.DTCRIACAO))
    END AS DIAS_RESTANTES,
    
    -- Prioridade Visual
    CASE
        WHEN REQ.STATUS IN (2, 3, -2) THEN 'CONCLUÍDO'
        WHEN DATEDIFF(DAY, GETDATE(), DATEADD(DAY, 20, REQ.DTCRIACAO)) < 0 THEN 'ATRASADO'
        WHEN DATEDIFF(DAY, GETDATE(), DATEADD(DAY, 20, REQ.DTCRIACAO)) = 0 THEN 'VENCE HOJE'
        WHEN DATEDIFF(DAY, GETDATE(), DATEADD(DAY, 20, REQ.DTCRIACAO)) BETWEEN 1 AND 3 THEN 'URGENTE'
        ELSE 'NO PRAZO'
    END AS PRIORIDADE,
    
    -- Tipo de Origem (deve ser 'R' para rescisão)
    CASE 
        WHEN REQ.ORIGEMTIPO = 'R' THEN 'RESCISÃO' 
        WHEN REQ.ORIGEMTIPO = 'V' THEN 'FÉRIAS'
        WHEN REQ.ORIGEMTIPO = 'S' THEN 'ALTERAÇÃO CARGO/SALÁRIO'
        WHEN REQ.ORIGEMTIPO = 'G' THEN 'ALTERAÇÃO CARGA HORÁRIA'
        WHEN REQ.ORIGEMTIPO = 'D' THEN 'DÉCIMO TERCEIRO'
        WHEN REQ.ORIGEMTIPO = 'E' THEN 'ALTERAÇÃO ENDEREÇO'
        WHEN REQ.ORIGEMTIPO = 'T' THEN 'TRANSFERÊNCIA DE EMPRESA'
        WHEN REQ.ORIGEMTIPO = 'C' THEN 'ALTERAÇÃO DADOS CADASTRAIS'
        WHEN REQ.ORIGEMTIPO = 'F' THEN 'AFASTAMENTO'
        ELSE 'OUTRO'
    END AS TIPO_REQUISICAO,
    
    -- Dados da Empresa
    REQ.CODEMP,
    CONCAT(RIGHT('000'+ CAST(REQ.CODEMP AS VARCHAR(3)), 3), ' - ', RTRIM(LTRIM(EMP.NOMEFANTASIA))) AS EMPRESA,
    
    -- Dados do Funcionário
    REQ.CODFUNC,
    CONCAT(RIGHT('000000' + CAST(REQ.CODFUNC AS VARCHAR(6)), 6), ' - ', RTRIM(LTRIM(FUN.NOMEFUNC))) AS FUNCIONARIO,
    RTRIM(LTRIM(FUN.CPF)) AS CPF,
    
    -- Dados do Departamento
    RTRIM(LTRIM(DEP.DESCRDEP)) AS DEPARTAMENTO,
    
    -- Dados do Cargo
    RTRIM(LTRIM(CAR.DESCRCARGO)) AS CARGO,
    
    -- Solicitante
    CONCAT(RIGHT('000000' + CAST(USU.CODUSU AS VARCHAR(6)), 6), ' - ', RTRIM(LTRIM(USU.NOMEUSU))) AS SOLICITANTE,
    
    -- Observação
    RTRIM(LTRIM(REQ.OBSERVACAO)) AS OBSERVACAO,
    
    -- Tempo na empresa
    DATEDIFF(DAY, FUN.DTADM, GETDATE()) AS DIAS_NA_EMPRESA,
    FUN.DTADM AS DATA_ADMISSAO

FROM 
    TFPREQ REQ
    JOIN TFPFUN FUN ON FUN.CODFUNC = REQ.CODFUNC AND FUN.CODEMP = REQ.CODEMP
    JOIN TSIUSU USU ON USU.CODUSU = REQ.CODUSU
    JOIN TFPCAR CAR ON CAR.CODCARGO = FUN.CODCARGO
    LEFT JOIN TFPDEP DEP ON DEP.CODDEP = FUN.CODDEP
    JOIN TSIEMP EMP ON EMP.CODEMP = REQ.CODEMP

WHERE 
    REQ.ORIGEMTIPO = 'R'  -- Apenas requisições de RESCISÃO
    ${periodoBase}
    ${whereClause}

ORDER BY 
    CASE
        WHEN REQ.STATUS IN (2, 3, -2) THEN 999  -- Concluídos por último
        ELSE DATEDIFF(DAY, GETDATE(), DATEADD(DAY, 20, REQ.DTCRIACAO))  -- Ordenar por urgência
    END ASC,
    REQ.DTCRIACAO DESC;
`;
};
