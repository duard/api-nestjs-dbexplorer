// Query salva para consulta de acessos por portões (ad_hikvision_events)
// Utilize esta query no InspectionService ou onde necessário

export const queryPortoesAcessos = `
SELECT DISTINCT
    CAST(FUN.IMAGEM AS VARBINARY(MAX)) AS IMAGEM, -- CORRECAO DO ERRO DE DISTINCT
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
        $P{P_IP_PORTAO} IS NULL
        OR $P{P_IP_PORTAO} = ''
        OR ($P{P_IP_PORTAO} = '1' AND HIK.ip = '192.168.3.93')
        OR ($P{P_IP_PORTAO} = '2' AND HIK.ip = '192.168.3.92')
        OR ($P{P_IP_PORTAO} = '3' AND HIK.ip = '192.168.3.91')
        OR ($P{P_IP_PORTAO} = '4' AND HIK.ip = '192.168.3.90')
        OR (HIK.ip = $P{P_IP_PORTAO})
    )
ORDER BY
    NOME_FUNCIONARIO,
    HIK.name
`;
