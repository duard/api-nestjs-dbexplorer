ELECT
    (SELECT NOMEUSU FROM TSIULG WHERE SPID = @@SPID),

    --------------------------------------------------------------------------------------
    -- FUNCIONARIO
    --------------------------------------------------------------------------------------
    funcionarios.CODFUNC,
    funcionarios.CODEMP,
    
    
    
    funcionarios.NOMEFUNC,
    FORMAT(CAST(funcionarios.DTNASC AS DATE), 'dd/MM/yyyy'),
    DATEDIFF(YEAR, CAST(funcionarios.DTNASC AS DATE), GETDATE())
        - CASE
            WHEN MONTH(CAST(funcionarios.DTNASC AS DATE)) > MONTH(GETDATE())
              OR (MONTH(CAST(funcionarios.DTNASC AS DATE)) = MONTH(GETDATE())
              AND DAY(CAST(funcionarios.DTNASC AS DATE)) > DAY(GETDATE()))
            THEN 1 ELSE 0
          END,
    FORMAT(funcionarios.DTADM, 'dd/MM/yyyy'),
    DATEDIFF(DAY, funcionarios.DTADM, GETDATE()),
    SUBSTRING(funcionarios.CPF,1,3) + '.' +
    SUBSTRING(funcionarios.CPF,4,3) + '.' +
    SUBSTRING(funcionarios.CPF,7,3) + '-' +
    SUBSTRING(funcionarios.CPF,10,2),
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
    END,

    usuarios.CODUSU,
    usuarios.NOMEUSU,
    usuarios.EMAIL,
    usuarios.FOTO,
    usuarios.AD_TELEFONECORP,
    cargaHoraria.DESCRCARGAHOR,
    departamento.DESCRDEP,
    COALESCE(cargo.DESCRCARGO, 'Nao informado'),
    centroResultado.DESCRCENCUS,

    --------------------------------------------------------------------------------------
    -- GESTOR
    --------------------------------------------------------------------------------------
    gestorUsuarios.CODUSU,
    gestorUsuarios.NOMEUSU,
    gestorUsuarios.EMAIL,
    CONCAT(
        RIGHT('000000' + CAST(gestorUsuarios.CODUSU AS VARCHAR(6)), 6),
        ' ',
        gestorUsuarios.NOMEUSU
    ),

    FORMAT(CAST(gestorFunc.DTNASC AS DATE), 'dd/MM/yyyy'),
    DATEDIFF(YEAR, CAST(gestorFunc.DTNASC AS DATE), GETDATE())
        - CASE
            WHEN MONTH(CAST(gestorFunc.DTNASC AS DATE)) > MONTH(GETDATE())
              OR (MONTH(CAST(gestorFunc.DTNASC AS DATE)) = MONTH(GETDATE())
              AND DAY(CAST(gestorFunc.DTNASC AS DATE)) > DAY(GETDATE()))
            THEN 1 ELSE 0
          END,
    SUBSTRING(gestorFunc.CPF,1,3) + '.' +
    SUBSTRING(gestorFunc.CPF,4,3) + '.' +
    SUBSTRING(gestorFunc.CPF,7,3) + '-' +
    SUBSTRING(gestorFunc.CPF,10,2),
    gestorFunc.CELULAR,

    gestorDepto.DESCRDEP,
    COALESCE(gestorCargo.DESCRCARGO, 'Nao informado'),
    gestorCentroResultado.DESCRCENCUS,
    FORMAT(gestorFunc.DTADM, 'dd/MM/yyyy'),
    DATEDIFF(DAY, gestorFunc.DTADM, GETDATE()),

    --------------------------------------------------------------------------------------
    -- EMPRESA
    --------------------------------------------------------------------------------------
    empresa.CODEMP,
    empresa.NOMEFANTASIA,
    SUBSTRING(empresa.CGC, 1, 2) + '.' +
    SUBSTRING(empresa.CGC, 3, 3) + '.' +
    SUBSTRING(empresa.CGC, 6, 3) + '/' +
    SUBSTRING(empresa.CGC, 9, 4) + '-' +
    SUBSTRING(empresa.CGC, 13, 2),
    CONCAT(
        RIGHT('000' + CAST(empresa.CODEMP AS VARCHAR(3)), 3),
        ' ',
        empresa.NOMEFANTASIA
    )

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
JOIN TSIUSU gestorUsuarios
    ON gestorUsuarios.CODUSU = centroResultado.CODUSURESP
LEFT JOIN TFPFUN gestorFunc
    ON gestorFunc.CODEMP = gestorUsuarios.CODEMP
   AND gestorFunc.CODFUNC = gestorUsuarios.CODFUNC
LEFT JOIN TFPDEP gestorDepto
    ON gestorDepto.CODDEP = gestorFunc.CODDEP
LEFT JOIN TFPCAR gestorCargo
    ON gestorCargo.CODCARGO = gestorFunc.CODCARGO
LEFT JOIN TSICUS gestorCentroResultado
    ON gestorCentroResultado.CODCENCUS = gestorUsuarios.CODCENCUSPAD
JOIN TSIEMP empresa
    ON empresa.CODEMP = funcionarios.CODEMP
LEFT JOIN TFPCGH cargaHoraria
    ON cargaHoraria.CODCARGAHOR = funcionarios.CODCARGAHOR

WHERE usuarios.CODUSU > 0
