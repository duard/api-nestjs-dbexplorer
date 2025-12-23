// Query salva para consulta de acessos por portões (ad_hikvision_events)
// Utilize esta query no InspectionService ou onde necessário

export const queryPortoesAcessos = `
SELECT
    FUN.CODFUNC AS CODIGO_FUNCIONARIO,
    FUN.NOMEFUNC AS NOME_FUNCIONARIO,
    EMP.RAZAOSOCIAL,
    FCO.DESCRCARGO AS FUNCAO,
    HIK.name AS Nome,
    HIK.ip AS IP,
    HIK.time AS DATA_HORA,
    CASE
        WHEN HIK.ip = '192.168.3.93' THEN 'PORTA RH, COMERCIAL, DIRETORIA'
        WHEN HIK.ip = '192.168.3.92' THEN 'ALMOXARIFADO PATIO 1'
        WHEN HIK.ip = '192.168.3.91' THEN 'PORTAO MENINO JESUS DE PRAGA'
        WHEN HIK.ip = '192.168.3.90' THEN 'ALMOXARIFADO PATIO 2'
        ELSE HIK.ip
    END AS Portao
FROM
    ad_hikvision_events HIK WITH (NOLOCK)
    LEFT JOIN TSIUSU USU WITH (NOLOCK) ON USU.NOMEUSU IS NOT NULL AND (
        HIK.name = USU.NOMEUSU
        OR HIK.name = USU.NOMEUSUCPLT
        OR CHARINDEX(REPLACE(USU.NOMEUSU, '.', ''), HIK.name) > 0
        OR CHARINDEX(REPLACE(HIK.name, '.', ''), USU.NOMEUSUCPLT) > 0
    )
LEFT JOIN TFPFUN FUN WITH (NOLOCK) ON USU.CODFUNC = FUN.CODFUNC AND USU.CODEMP = FUN.CODEMP
LEFT JOIN TSIEMP EMP WITH (NOLOCK) ON EMP.CODEMP = FUN.CODEMP
LEFT JOIN TFPCAR FCO WITH (NOLOCK) ON FUN.CODCARGO = FCO.CODCARGO
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
    HIK.time DESC
OFFSET @param2 ROWS FETCH NEXT @param3 ROWS ONLY;
`;
