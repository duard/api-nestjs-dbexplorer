// Query to fetch unified person by partner ID (CODPARC)
export const PESSOAS_BYID_QUERY = `
SELECT TOP 1
    par.CODPARC,
    par.NOMEPARC,
    par.CGC_CPF,
    par.EMAIL,
    par.TELEFONE,
    par.CELULAR,
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
    par.CODFUNC
FROM TGFPAR par
WHERE par.CODPARC = @param1
`;
