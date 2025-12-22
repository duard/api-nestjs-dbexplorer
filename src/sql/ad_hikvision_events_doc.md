# Documentação Técnica: Tabela ad_hikvision_events

## Descrição
Tabela de eventos de acesso dos portões Hikvision. Cada linha representa um evento capturado pelo sistema, como entrada/saída de pessoas pelos portões monitorados.

## Principais Campos
- **ip**: IP do portão (exemplo: '192.168.3.93'). Identifica o portão físico.
- **name**: Nome do usuário capturado no evento (pode ser nome curto ou completo).
- **datahora**: Data e hora do evento (timestamp do acesso).

## Estrutura (Exemplo)
```sql
SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ad_hikvision_events';
```

## Exemplo de Dados
```sql
SELECT TOP 10 * FROM ad_hikvision_events;
```

## Possíveis Índices Recomendados
```sql
CREATE INDEX IDX_HIKVISION_IP ON ad_hikvision_events(ip);
CREATE INDEX IDX_HIKVISION_NAME ON ad_hikvision_events(name);
CREATE INDEX IDX_HIKVISION_DATAHORA ON ad_hikvision_events(datahora);
```

## Observações
- O campo correto de data/hora é provavelmente `datahora` (confirme no banco).
- Não existe campo `event_time`.
- Recomenda-se sempre validar os nomes dos campos e tipos antes de criar queries complexas.
- Para performance, crie índices nos campos mais usados em JOIN, WHERE e ORDER BY.

## Relacionamentos
- Pode ser relacionada com TSIUSU (usuários) via campo `name`.
- Pode ser filtrada por IP para identificar eventos de portões específicos.

---
*Atualize esta documentação conforme novas necessidades ou alterações na estrutura da tabela.*
