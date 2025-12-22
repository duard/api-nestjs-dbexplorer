# Schema Completo: ad_hikvision_events

## Estrutura dos Campos

```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ad_hikvision_events';
```

## Exemplo de Schema (preenchido com campos comuns, ajuste conforme seu banco):

| Nome do Campo | Tipo         | Tamanho | Aceita Nulo | Descrição                       |
|---------------|-------------|---------|-------------|----------------------------------|
| id            | INT         |         | NÃO         | Identificador único do evento    |
| ip            | VARCHAR     | 15      | NÃO         | IP do portão                    |
| name          | VARCHAR     | 100     | SIM         | Nome do usuário capturado        |
| datahora      | DATETIME    |         | NÃO         | Data/hora do evento              |
| tipo_evento   | VARCHAR     | 50      | SIM         | Tipo do evento (entrada/saída)   |
| ...           | ...         | ...     | ...         | Outros campos conforme o banco   |

## Como obter o schema real
Execute no SQL Server:
```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ad_hikvision_events';
```

## Observações
- Ajuste os campos conforme o resultado real do seu banco.
- Para ver exemplos de dados:
  ```sql
  SELECT TOP 10 * FROM ad_hikvision_events;
  ```
- Para ver chaves primárias e índices:
  ```sql
  EXEC sp_helpindex 'ad_hikvision_events';
  EXEC sp_pkeys 'ad_hikvision_events';
  ```

---
*Atualize este documento conforme alterações na estrutura da tabela.*
