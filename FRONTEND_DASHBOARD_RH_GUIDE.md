# Guia de Consumo da API – Dashboard RH

Este guia explica como o frontend pode consumir a API Sankhya Simples para o Dashboard RH, incluindo autenticação, headers, exemplos de requisições e dicas para lidar com CORS.

---

## 1. Autenticação

Todas as rotas protegidas exigem autenticação JWT.

### 1.1. Login
- **Endpoint:** `POST /auth/login`
- **Body:**
```json
{
  "username": "CONVIDADO",
  "password": "guest123"
}
```
- **Resposta:**
```json
{
  "access_token": "<JWT_TOKEN>"
}
```

### 1.2. Usando o Token
Inclua o token JWT no header de todas as requisições protegidas:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 2. CORS
- O backend já está configurado para aceitar requisições de domínios permitidos.
- Se houver erro CORS, verifique se o domínio do frontend está na lista de origens permitidas.
- O navegador faz uma requisição OPTIONS (preflight) antes de POST/PUT/DELETE. O backend responde automaticamente.

---

## 3. Endpoints Principais

### 3.1. Listar Pessoas
- **GET /sankhya/pessoas**
- **Headers:**
  - Authorization: Bearer <JWT_TOKEN>
- **Query Params (opcionais):**
  - nome, cpfCnpj, email, telefone, ativo, tipo, empresa, departamento, cargo, situacao, cliente, fornecedor, transportadora, vendedor, page, perPage
- **Exemplo:**
```
GET /sankhya/pessoas?nome=JOAO&page=1&perPage=10
```

### 3.2. Portões – Últimos Acessos
- **GET /sankhya/portoes/ultimos**
- **Headers:** Authorization: Bearer <JWT_TOKEN>
- **Query Params:** usuario, page, perPage

### 3.3. Portões – Acessos por Portão
- **GET /sankhya/portoes/portao/:id**
- **Headers:** Authorization: Bearer <JWT_TOKEN>
- **Query Params:** usuario, page, perPage

### 3.4. Portões – Todos os Acessos
- **GET /sankhya/portoes/acessos**
- **Headers:** Authorization: Bearer <JWT_TOKEN>
- **Query Params:** ipPortao, usuario, page, perPage

### 3.5. Usuários (TSIUSU)
- **GET /sankhya/tsiusu**
- **Headers:** Authorization: Bearer <JWT_TOKEN>
- **Query Params:** conforme documentação Swagger

---

## 4. Exemplo de Fluxo no Frontend

```js
// 1. Login
const resp = await fetch('http://localhost:3027/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'CONVIDADO', password: 'guest123' })
});
const { access_token } = await resp.json();

// 2. Consumir endpoint protegido
const pessoas = await fetch('http://localhost:3027/sankhya/pessoas?page=1&perPage=10', {
  headers: { Authorization: `Bearer ${access_token}` }
});
const data = await pessoas.json();
```

---

## 5. Dicas
- Sempre trate erros 401 (token expirado ou inválido) no frontend.
- Use os parâmetros de paginação para evitar grandes volumes de dados.
- Consulte a documentação Swagger em `/api` para detalhes de cada endpoint.
- Se precisar de novos filtros ou campos, solicite à equipe backend.

---

## 6. Referências
- [Swagger UI](http://localhost:3027/api)
- [Documentação Técnica](./API_DOCUMENTATION.md)

---

> Em caso de dúvidas, consulte os logs do backend para detalhes de CORS, autenticação e erros.
