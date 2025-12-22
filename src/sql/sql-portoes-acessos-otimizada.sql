-- Query otimizada para acessos por portões (paginada, sem imagem)
SELECT
    FUN.CODFUNC AS CODIGO_FUNCIONARIO,
    FUN.NOMEFUNC AS NOME_FUNCIONARIO,
    EMP.RAZAOSOCIAL,
    FCO.DESCRCARGO AS FUNCAO,
    HIK.name AS Nome,
    CASE
        WHEN HIK.ip = '192.168.3.93' THEN 'PORTA RH, COMERCIAL, DIRETORIA'
        WHEN HIK.ip = '192.168.3.92' THEN 'ALMOXARIFADO PATIO 1'
        WHEN HIK.ip = '192.168.3.91' THEN 'PORTAO MENINO JESUS DE PRAGA'
        WHEN HIK.ip = '192.168.3.90' THEN 'ALMOXARIFADO PATIO 2'
        ELSE HIK.ip
    END AS Portao
FROM
    ad_hikvision_events HIK
    LEFT JOIN TSIUSU USU ON
    (
        HIK.name COLLATE Latin1_General_CI_AI = USU.NOMEUSU
        OR HIK.name COLLATE Latin1_General_CI_AI = USU.NOMEUSUCPLT
        OR HIK.name COLLATE Latin1_General_CI_AI LIKE REPLACE(USU.NOMEUSU, '.', '%')
        OR USU.NOMEUSUCPLT COLLATE Latin1_General_CI_AI LIKE REPLACE(HIK.name, '.', '%')
    )
LEFT JOIN TFPFUN FUN ON USU.CODFUNC = FUN.CODFUNC AND USU.CODEMP = FUN.CODEMP
LEFT JOIN TSIEMP EMP ON EMP.CODEMP = FUN.CODEMP
LEFT JOIN TFPCAR FCO ON FUN.CODCARGO = FCO.CODCARGO
WHERE
    (
        @param1 IS NULL
        OR @param1 = ''
        OR (@param1 = '1' AND HIK.ip = '192.168.3.93')
        OR (@param1 = '2' AND HIK.ip = '192.168.3.92')
        OR (@param1 = '3' AND HIK.ip = '192.168.3.91')
        OR (@param1 = '4' AND HIK.ip = '192.168.3.90')
        OR (HIK.ip = @param1)
    )
ORDER BY
    FUN.NOMEFUNC,
    HIK.name
OFFSET @param2 ROWS FETCH NEXT @param3 ROWS ONLY;
