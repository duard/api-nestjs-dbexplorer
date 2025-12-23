# 📄 Documentação da Tabela TFPFUN

## 🗂️ Nome da Tabela
`TFPFUN`

## 🔑 Chaves Primárias
- `CODEMP` (int)
- `CODFUNC` (int)

## 🏷️ Colunas

| Nome da Coluna         | Tipo         | Aceita Nulo | Observações |
|------------------------|--------------|-------------|-------------|
| CODEMP                 | int          | NÃO         | PK          |
| CODFUNC                | int          | NÃO         | PK          |
| NOMEFUNC               | varchar      | SIM         |             |
| ...                    | ...          | ...         | ...         |

> **Nota:** A tabela possui muitas colunas. Consulte o endpoint `/inspection/table-schema?tableName=TFPFUN` para obter a lista completa.

## 🔗 Relações (Chaves Estrangeiras)
- Exemplo: `CODPARC` referencia `TGFPAR(CODPARC)`

## 📝 Exemplo de Consulta: Últimos 10 Registros

```sql
SELECT TOP 10
  F.CODEMP,
  F.CODFUNC,
  F.NOMEFUNC,
  U.CODUSU,
  U.NOMEUSU,
  P.CODPARC,
  P.NOMEPARC
FROM TFPFUN F
LEFT JOIN TSIUSU U
  ON F.CODEMP = U.CODEMP AND F.CODFUNC = U.CODFUNC
LEFT JOIN TGFPAR P
  ON F.CODPARC = P.CODPARC
ORDER BY F.CODEMP DESC, F.CODFUNC DESC;
```

> **Este é o exemplo padrão recomendado para a rota `/inspection/query`**

### 🔍 Exemplo de Resposta (JSON)

```json
[
  {
    "CODEMP": 5,
    "CODFUNC": 173,
    "NOMEFUNC": "PABLO HENRIQUE SOARES MESENCIO DA SILVA",
    ...
  },
  {
    "CODEMP": 5,
    "CODFUNC": 172,
    "NOMEFUNC": "AGNALDO DE OLIVEIRA PINTO FILHO",
    ...
  }
  // ...outros registros
]
```

## 🔒 Como Consultar Usando a API

1. **Autentique-se:**

```bash
curl -X POST 'http://localhost:3027/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username": "CONVIDADO", "password": "guest123"}'
```

2. **Execute a consulta:**

```bash
curl -X POST 'http://localhost:3027/inspection/query' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -H 'Content-Type: application/json' \
  -d '{"query": "SELECT TOP 10 F.CODEMP, F.CODFUNC, F.NOMEFUNC, U.CODUSU, U.NOMEUSU, P.CODPARC, P.NOMEPARC FROM TFPFUN F LEFT JOIN TSIUSU U ON F.CODEMP = U.CODEMP AND F.CODFUNC = U.CODFUNC LEFT JOIN TGFPAR P ON F.CODPARC = P.CODPARC ORDER BY F.CODEMP DESC, F.CODFUNC DESC;"}'
```

---

> Documentação gerada automaticamente em 23/12/2025.
