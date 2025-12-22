# Guia Rápido: Autenticação e Ferramentas de Inspeção SQL

## 1. Autenticação via API

Antes de acessar rotas protegidas, obtenha um token JWT autenticando-se com:

```sh
curl -X 'POST' \
  'http://127.0.0.1:3027/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "CONVIDADO",
  "password": "guest123"
}'
```
O retorno será um JSON com o campo `access_token`. Use esse token nas próximas requisições protegidas.

---

## 2. Descobrindo Estrutura de Tabelas

Para evitar erros ao montar consultas SQL, utilize a rota auxiliar para listar os campos de uma tabela:

```sh
curl -X 'GET' \
  'http://127.0.0.1:3027/inspection/table-schema?tableName=TGFPAR' \
  -H 'accept: application/json'
```

---

## 3. Descobrindo Relacionamentos

Para saber os relacionamentos (chaves estrangeiras, etc):

```sh
curl -X 'GET' \
  'http://127.0.0.1:3027/inspection/table-relations/TGFPAR' \
  -H 'accept: */*'
```

---

## 4. Descobrindo Chaves Primárias

Para saber as chaves primárias de uma tabela:

```sh
curl -X 'GET' \
  'http://127.0.0.1:3027/inspection/primary-keys/TGFPAR' \
  -H 'accept: application/json'
```

---


## 5. Tabelas e Campos Usados em Portões

### ad_hikvision_events
- **Descrição:** Eventos de acesso dos portões (Hikvision)
- **Campos relevantes:**
  - `ip`: IP do portão (ex: 192.168.3.93)
  - `name`: Nome do usuário capturado no evento
  - `datahora` (ou similar): Data/hora do evento (**não existe `event_time`**)

### TSIUSU
- **Descrição:** Usuários do sistema
- **Campos relevantes:**
  - `NOMEUSU`, `NOMEUSUCPLT`: Nome do usuário
  - `CODFUNC`, `CODEMP`: Chave para funcionário

### TFPFUN
- **Descrição:** Funcionários
- **Campos relevantes:**
  - `CODFUNC`, `CODEMP`: Chave primária
  - `NOMEFUNC`: Nome do funcionário
  - `IMAGEM`: Foto do funcionário
  - `CODCARGO`: Cargo

### TSIEMP
- **Descrição:** Empresas
- **Campos relevantes:**
  - `CODEMP`: Código da empresa
  - `RAZAOSOCIAL`: Nome da empresa

### TFPCAR
- **Descrição:** Cargos
- **Campos relevantes:**
  - `CODCARGO`: Código do cargo
  - `DESCRCARGO`: Descrição do cargo

---

## 6. Dicas para Inspeção SQL

- O campo correto de data/hora em `ad_hikvision_events` provavelmente é `datahora` (ou similar), não `event_time`.
- Sempre valide os nomes dos campos no banco antes de criar queries.
- Para listar todos os campos de uma tabela:
  ```sql
  SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ad_hikvision_events';
  ```
- Para ver exemplos de dados:
  ```sql
  SELECT TOP 10 * FROM ad_hikvision_events;
  ```

---

*Atualize este guia conforme novas tabelas/campos forem utilizados.*
