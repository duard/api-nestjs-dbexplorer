
SELECT TOP 1
    par.CODPARC,
    par.NOMEPARC,
    par.CGC_CPF,
    par.EMAIL AS EMAIL_PARCEIRO,
    par.TELEFONE AS TELEFONE_PARCEIRO,
    par.CELULAR AS CELULAR_PARCEIRO,
    par.ENDERECO,
    par.NUMERO,
    par.COMPLEMENTO,
    par.BAIRRO,
    par.CEP,
    par.CODMUN,
    par.UF,
    par.CODPAIS,
    par.ATIVO,
    par.CLIENTE,
    par.FORNECEDOR,
    par.TRANSPORTADORA,
    par.VENDEDOR,
    par.FUNCIONARIO,
    par.DTATUAL,
    par.OBS,
    par.CODUSU,
    par.CODFUNC,
    func.CODFUNC AS FUNC_CODFUNC,
    func.CODEMP AS FUNC_CODEMP,
    func.NOMEFUNC,
    FORMAT(CAST(func.DTNASC AS DATE), 'dd/MM/yyyy') AS FUNC_DTNASC,
    func.CPF AS FUNC_CPF,
    func.CELULAR AS FUNC_CELULAR,
    func.EMAIL AS FUNC_EMAIL,
    func.SITUACAO AS FUNC_SITUACAO,
    -- func.SITUACAODESCRICAO removido: coluna não existe
    usu.CODUSU AS USU_CODUSU,
    usu.NOMEUSU,
    usu.EMAIL AS USU_EMAIL,
    usu.AD_TELEFONECORP,
    usu.FOTO AS USU_FOTO
FROM TGFPAR par
LEFT JOIN TFPFUN func ON func.CODPARC = par.CODPARC
LEFT JOIN TSIUSU usu ON usu.CODFUNC = func.CODFUNC
WHERE par.CODPARC = @param1
