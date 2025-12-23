import { TurnoverFilters, TurnoverQueryBuilder } from '../interfaces/turnover-filters.interface';

// Score de Risco de Evasão - Identifica funcionários com maior probabilidade de sair
export const getScoreRiscoEvasaoQuery = (filters: TurnoverFilters = {}): string => {
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
WITH ANALISE_RISCO AS (
    SELECT 
    F.CODFUNC,
    F.CODEMP,
        RTRIM(LTRIM(F.NOMEFUNC)) AS NOME,
        RTRIM(LTRIM(D.DESCRDEP)) AS DEPARTAMENTO,
        RTRIM(LTRIM(C.DESCRCARGO)) AS CARGO,
        F.DTADM,
        DATEDIFF(MONTH, F.DTADM, GETDATE()) AS MESES_EMPRESA,
        F.SALBASE,
        
        -- Fator 1: Tempo de empresa (risco alto: < 6 meses ou > 36 meses)
        CASE 
            WHEN DATEDIFF(MONTH, F.DTADM, GETDATE()) < 6 THEN 30
            WHEN DATEDIFF(MONTH, F.DTADM, GETDATE()) > 36 THEN 25
            ELSE 0
        END AS RISCO_TEMPO_CASA,
        
        -- Fator 2: Salário abaixo da média do cargo
        CASE 
            WHEN F.SALBASE < (
                SELECT AVG(F2.SALBASE) * 0.85 
                FROM TFPFUN F2 
                WHERE F2.CODCARGO = F.CODCARGO 
                  AND F2.SITUACAO = '1'
            ) THEN 35
            WHEN F.SALBASE < (
                SELECT AVG(F2.SALBASE) * 0.95 
                FROM TFPFUN F2 
                WHERE F2.CODCARGO = F.CODCARGO 
                  AND F2.SITUACAO = '1'
            ) THEN 20
            ELSE 0
        END AS RISCO_SALARIO,
        
        -- Fator 3: Tempo desde último ajuste salarial
        CASE 
            WHEN F.SALBASE = F.SALBASEANTERIOR THEN 15
            ELSE 0
        END AS RISCO_SEM_AUMENTO,
        
        -- Fator 4: Departamento com alto turnover
        CASE 
            WHEN (
                SELECT COUNT(*) 
                FROM TFPFUN F2 
                WHERE F2.CODDEP = F.CODDEP 
                  AND F2.DTDEM >= DATEADD(MONTH, -12, GETDATE())
            ) * 100.0 / (
                SELECT COUNT(*) 
                FROM TFPFUN F3 
                WHERE F3.CODDEP = F.CODDEP 
                  AND F3.SITUACAO IN ('0', '1')
            ) > 30 THEN 20
            ELSE 0
        END AS RISCO_DEPARTAMENTO
        
    FROM TFPFUN F
    LEFT JOIN TFPDEP D ON F.CODDEP = D.CODDEP
    LEFT JOIN TFPCAR C ON F.CODCARGO = C.CODCARGO
    LEFT JOIN TSIEMP EMP ON EMP.CODEMP = F.CODEMP
    WHERE F.SITUACAO = '1'
      ${whereClause}
)
SELECT 
  CODFUNC,
  CODEMP,
    NOME,
    DEPARTAMENTO,
    CARGO,
    DTADM,
    MESES_EMPRESA,
    SALBASE,
    RISCO_TEMPO_CASA,
    RISCO_SALARIO,
    RISCO_SEM_AUMENTO,
    RISCO_DEPARTAMENTO,
    (RISCO_TEMPO_CASA + RISCO_SALARIO + RISCO_SEM_AUMENTO + RISCO_DEPARTAMENTO) AS SCORE_RISCO_TOTAL,
    CASE 
        WHEN (RISCO_TEMPO_CASA + RISCO_SALARIO + RISCO_SEM_AUMENTO + RISCO_DEPARTAMENTO) >= 70 THEN 'CRÍTICO'
        WHEN (RISCO_TEMPO_CASA + RISCO_SALARIO + RISCO_SEM_AUMENTO + RISCO_DEPARTAMENTO) >= 50 THEN 'ALTO'
        WHEN (RISCO_TEMPO_CASA + RISCO_SALARIO + RISCO_SEM_AUMENTO + RISCO_DEPARTAMENTO) >= 30 THEN 'MÉDIO'
        ELSE 'BAIXO'
    END AS NIVEL_RISCO
FROM ANALISE_RISCO
WHERE (RISCO_TEMPO_CASA + RISCO_SALARIO + RISCO_SEM_AUMENTO + RISCO_DEPARTAMENTO) >= 30
ORDER BY SCORE_RISCO_TOTAL DESC
`;
};
