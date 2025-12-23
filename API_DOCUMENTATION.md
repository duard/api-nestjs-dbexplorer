# 📋 API Sankhya Simples - Documentação Completa

## 🚀 Visão Geral

API NestJS para inspeção de banco de dados Sankhya com autenticação JWT.

### 🔥 Base URL

```
http://localhost:3027
```

### 🛡️ Swagger UI

```
http://localhost:3027/api
```

---

## 🔐 Autenticação (Auth)

### 1. Login

Obter token JWT para acessar os endpoints.

```bash
curl -X 'POST' \
  'http://localhost:3027/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "CONVIDADO",
    "password": "guest123"
  }'
```

**✅ Resposta de Sucesso:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNBUkxPUy5BUVVJTk8iLCJzdWIiOjE3NjY0MTI2NjUsImV4cCI6MTc2NjQxNjI2NX0.6rZBryV0gx9OAlnSvNL03gi3aqmo0Cn8hTrh3dJZ3Go"
}
```

### 2. Perfil do Usuário

Obter dados do usuário autenticado.

```bash
curl -X 'POST' \
  'http://localhost:3027/auth/profile' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNBUkxPUy5BUVVJTk8iLCJzdWIiOjE3NjY0MTI2NjUsImV4cCI6MTc2NjQxNjI2NX0.6rZBryV0gx9OAlnSvNL03gi3aqmo0Cn8hTrh3dJZ3Go"
```

**✅ Resposta:**

```json
{
  "userId": 311,
  "username": "CONVIDADO"
}
```

---

## 📊 Inspeção de Banco de Dados (Inspection)

### 1. Listar Todas as Tabelas

Lista todas as tabelas disponíveis no banco de dados.

```bash
curl -X 'GET' \
  'http://localhost:3027/inspection/tables' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

**✅ Resposta:**

```json
{
  "tables": [
    { "TABLE_NAME": "TFPFUN", "TABLE_TYPE": "BASE TABLE" },
    { "TABLE_NAME": "TGFPAR", "TABLE_TYPE": "BASE TABLE" },
    { "TABLE_NAME": "TSIUSU", "TABLE_TYPE": "BASE TABLE" }
  ],
  "totalTables": 3
}
```

### 2. Schema da Tabela

Obter estrutura detalhada de uma tabela específica.

```bash
curl -X 'GET' \
  'http://localhost:3027/inspection/table-schema?tableName=TFPFUN' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

**✅ Resposta:**

```json
{
  "tableName": "TFPFUN",
  "columns": [
    {
      "COLUMN_NAME": "CODFUN",
      "DATA_TYPE": "int",
      "IS_NULLABLE": "NO",
      "ORDINAL_POSITION": 1
    },
    {
      "COLUMN_NAME": "NOMEFUNC",
      "DATA_TYPE": "varchar",
      "IS_NULLABLE": "YES",
      "ORDINAL_POSITION": 2
    }
  ],
  "totalColumns": 2
}
```

### 3. Relações da Tabela (Chaves Estrangeiras)

Listar todas as relações de chaves estrangeiras de uma tabela.

```bash
curl -X 'GET' \
  'http://localhost:3027/inspection/table-relations?tableName=TFPFUN' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

**✅ Resposta:**

```json
{
  "tableName": "TFPFUN",
  "relations": [
    {
      "ForeignKeyName": "FK_TFPFUN_TGFPAR",
      "ParentTable": "TFPFUN",
      "ParentColumn": "CODPARC",
      "ReferencedTable": "TGFPAR",
      "ReferencedColumn": "CODPARC",
      "DeleteAction": "NO_ACTION",
      "UpdateAction": "NO_ACTION"
    }
  ],
  "totalRelations": 1
}
```

### 4. Chaves Primárias

Listar todas as chaves primárias de uma tabela.

```bash
curl -X 'GET' \
  'http://localhost:3027/inspection/primary-keys/TFPFUN' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

**✅ Resposta:**

```json
{
  "tableName": "TFPFUN",
  "primaryKeys": [
    {
      "COLUMN_NAME": "CODFUN",
      "ORDINAL_POSITION": 1,
      "CONSTRAINT_NAME": "PK_TFPUN"
    }
  ],
  "totalPrimaryKeys": 1
}
```

### 5. Executar Query SQL

Executar consultas SQL customizadas (apenas SELECT, por segurança).

```bash
curl -X 'POST' \
  'http://localhost:3027/inspection/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "query": "SELECT TOP 10 CODFUNC, NOMEFUNC FROM TFPFUN ORDER BY CODFUNC DESC",
    "params": []
  }'
```

**✅ Resposta:**

```json
{
  "query": "SELECT TOP 10 CODFUN, NOMEFUNC FROM TFPUN WHERE ATIVO = 'S'",
  "params": ["S"],
  "data": [
    { "CODFUN": 100, "NOMEFUNC": "João Silva" },
    { "CODFUN": 200, "NOMEFUNC": "Maria Santos" }
  ],
  "rowCount": 2
}
```

---

## 🏥 Sistema de Logs

### Informações Capturadas

Cada requisição é logada com:

- 📥 **Timestamp** da requisição
- 🌐 **Método HTTP** (GET, POST, OPTIONS, etc.)
- 🌍 **URL** do endpoint
- 🏠 **IP** do cliente
- 🧑 **User-Agent** do navegador
- 👤 **ID do Usuário** (extraído do token ou corpo da requisição)
- 📤 **Status Code** da resposta (200, 401, 404, etc.)
- ⏱️ **Duração** da requisição em milissegundos
- 📄 **Response Body** completo (formatado JSON)
- ❌ **Error Details** quando aplicável

### Exemplo de Log Completo

```
📥 [2025-12-22T16:08:52.563Z] POST /auth/login
   IP: 192.168.1.100
   User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0
   👤 Requesting User: User: CARLOS.AQUINO
   🌐 IP: 192.168.1.100
   🔧 User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0
📤 [2025-12-22T16:08:52.563Z] POST /auth/login - 201 (199ms)
   📊 Response Status: 201
   ⏱️ Duration: 199ms
   🎫 Response Body: {"access_token":"eyJhbGci..."}
   🆔 User ID in Token: 292
```

---

## 🔧 Endpoints Adicionais

### Health Check

```bash
curl -X 'GET' 'http://localhost:3027/health'
```

### Version

```bash
curl -X 'GET' 'http://localhost:3027/version'
```

---

## 🛡️ Modo de Desenvolvimento

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no seu arquivo `.env`:

```env
SQLSERVER_USER=seu_usuario
SQLSERVER_PASSWORD=sua_senha
SQLSERVER_SERVER=seu_servidor
SQLSERVER_DATABASE=seu_banco
JWT_SECRET=sua_chave_secreta
PORT=3027
```

### Para Iniciar a Aplicação

```bash
# Modo desenvolvimento
pnpm start:dev

# Modo produção
pnpm start:prod
```

---

## 📚 Exemplos de Uso Avançado

### Consulta Complexa com Múltiplos Parâmetros

```bash
curl -X 'POST' \
  'http://localhost:3027/inspection/query' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "SELECT f.CODFUNC, f.NOMEFUNC, e.NOMEFANTASIA, e.RAZAOSOCIAL FROM TFPUN f INNER JOIN TSIUSU u ON f.CODFUNC = u.CODFUNC WHERE u.NOMEUSU LIKE @param1 AND e.DTDEMISSAO IS NOT NULL ORDER BY f.NOMEFUNC",
    "params": ["%SILVA%"]
  }'
```

### Paginação de Resultados

```bash
curl -X 'POST' \
  'http://localhost:3027/inspection/query' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -d '{
    "query": "SELECT * FROM TFPUN ORDER BY CODFUN OFFSET @param1 ROWS FETCH NEXT @param2 ROWS ONLY",
    "params": [0, 10]
  }'
```

### Verificação de Tabelas

```bash
# Verificar se tabela existe
curl -X 'GET' \
  'http://localhost:3027/inspection/table-schema?tableName=TABELA_INEXISTENTE' \
  -H 'Authorization: Bearer SEU_TOKEN'

# Listar schema completo de múltiplas tabelas
curl -X 'GET' \
  'http://localhost:3027/inspection/tables' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  | jq '.tables[] | select(.TABLE_NAME)'
```

---

## 🔒 Códigos de Status

| Código | Descrição         |
| ------ | ----------------- |
| 200    | ✅ Sucesso        |
| 201    | 📝 Criado         |
| 400    | ❌ Bad Request    |
| 401    | 🔐 Não Autorizado |
| 404    | 🚫 Não Encontrado |
| 500    | 💥 Erro Interno   |

---

## 🎯 Considerações Finais

### 🔐 Segurança

- Sempre use HTTPS em produção
- Configure tempos de expiração adequados para tokens JWT
- Valide todos os parâmetros de entrada
- Use as queries parametrizadas para evitar SQL Injection

### 🚀 Performance

- As queries de inspeção usam `LIMIT` para evitar sobrecarga
- Logs são capturados apenas em modo desenvolvimento
- Use conexão pooling para melhor desempenho

### 📝 Monitoramento

- Logs mostram timestamp, IP, User-Agent para auditoria
- Tempo de resposta é medido para performance tracking
- Erros SQL são capturados com detalhes completos

---

## 🎉 Suporte

Para dúvidas ou problemas, verifique:

1. Logs detalhados no terminal
2. Documentação Swagger em `http://localhost:3027/api`
3. Status do serviço em `/health`

**API 100% funcional e pronta para uso! 🚀**
