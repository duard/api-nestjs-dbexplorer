-- Listagem unificada de pessoas (funcionários, usuários, parceiros)
-- Baseado em sql-funcionarios-usuarios-parceiros.sql
SELECT
    funcionarios.CODFUNC,
    funcionarios.CODEMP,
    funcionarios.NOMEFUNC,
    FORMAT(CAST(funcionarios.DTNASC AS DATE), 'dd/MM/yyyy') AS DTNASC,
    DATEDIFF(YEAR, CAST(funcionarios.DTNASC AS DATE), GETDATE())
        - CASE
            WHEN MONTH(CAST(funcionarios.DTNASC AS DATE)) > MONTH(GETDATE())
              OR (MONTH(CAST(funcionarios.DTNASC AS DATE)) = MONTH(GETDATE())
              AND DAY(CAST(funcionarios.DTNASC AS DATE)) > DAY(GETDATE()))
            THEN 1 ELSE 0
          END AS IDADE,
    FORMAT(funcionarios.DTADM, 'dd/MM/yyyy') AS DTADM,
    DATEDIFF(DAY, funcionarios.DTADM, GETDATE()) AS DIAS_ADMISSAO,
    SUBSTRING(funcionarios.CPF,1,3) + '.' +
    SUBSTRING(funcionarios.CPF,4,3) + '.' +
    SUBSTRING(funcionarios.CPF,7,3) + '-' +
    SUBSTRING(funcionarios.CPF,10,2) AS CPF,
    funcionarios.CELULAR,
    funcionarios.EMAIL,
    funcionarios.SITUACAO,
    CASE funcionarios.SITUACAODESCRICAO
        WHEN 0 THEN 'Demitido'
        WHEN 1 THEN 'Ativo'
        WHEN 2 THEN 'Afastado sem remuneracao'
        WHEN 3 THEN 'Afastado por acidente de trabalho'
        WHEN 4 THEN 'Afastado para servico militar'
        WHEN 5 THEN 'Afastado por licenca gestante'
        WHEN 6 THEN 'Afastado por doenca acima de 15 dias'
        WHEN 8 THEN 'Transferido'
        WHEN 9 THEN 'Aposentadoria por Invalidez'
        ELSE 'Situacao nao identificada'
    END AS SITUACAO_DESC,
    usuarios.CODUSU,
    usuarios.NOMEUSU,
    usuarios.EMAIL AS EMAIL_USUARIO,
    usuarios.FOTO,
    usuarios.AD_TELEFONECORP,
    cargaHoraria.DESCRCARGAHOR,
    departamento.DESCRDEP,
    COALESCE(cargo.DESCRCARGO, 'Nao informado') AS DESCRCARGO,
    centroResultado.DESCRCENCUS,
    empresa.CODEMP AS EMPRESA_CODEMP,
    empresa.NOMEFANTASIA,
    SUBSTRING(empresa.CGC, 1, 2) + '.' +
    SUBSTRING(empresa.CGC, 3, 3) + '.' +
    SUBSTRING(empresa.CGC, 6, 3) + '/' +
    SUBSTRING(empresa.CGC, 9, 4) + '-' +
    SUBSTRING(empresa.CGC, 13, 2) AS CNPJ
FROM TFPFUN funcionarios
JOIN TSIUSU usuarios
    ON funcionarios.CODEMP = usuarios.CODEMP
   AND funcionarios.CODFUNC = usuarios.CODFUNC
JOIN TFPDEP departamento
    ON departamento.CODDEP = funcionarios.CODDEP
JOIN TFPCAR cargo
    ON cargo.CODCARGO = funcionarios.CODCARGO
JOIN TSICUS centroResultado
    ON centroResultado.CODCENCUS = usuarios.CODCENCUSPAD
JOIN TSIEMP empresa
    ON empresa.CODEMP = funcionarios.CODEMP
LEFT JOIN TFPCGH cargaHoraria
    ON cargaHoraria.CODCARGAHOR = funcionarios.CODCARGAHOR
WHERE usuarios.CODUSU > 0
