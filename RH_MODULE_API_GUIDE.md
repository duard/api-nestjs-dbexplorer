# Documentação do Módulo RH (src/modules/sankhya/rh)

Este documento descreve os endpoints, filtros e funcionamento do módulo RH da API Sankhya Simples, voltado para dashboards e análises de Recursos Humanos.

---

## Endpoints Principais

Todos os endpoints exigem autenticação JWT (Bearer Token).

### 1. Dashboard Executivo
- **GET /rh/dashboard/executivo**
- **Descrição:** Retorna todos os KPIs principais do RH (headcount, admissões, demissões, custos, riscos, etc).
- **Query Params:**
  - dataInicio, dataFim, codemp, coddep, codcargo, situacao, etc (ver RhFiltersDto)

### 2. Funcionários por Departamento
- **GET /rh/funcionarios/departamento**
- **Descrição:** Lista funcionários agrupados por departamento/cargo.
- **Query Params:** Filtros de período, empresa, departamento, cargo, etc.

### 3. Turnover com Filtros
- **GET /rh/turnover/filtros**
- **Descrição:** KPIs de turnover com filtros avançados.
- **Query Params:** Filtros de período, empresa, departamento, cargo, etc.

### 4. Análise de Desligamentos
- **GET /rh/analise/desligamentos**
- **Descrição:** Análise detalhada de desligamentos no período.
- **Query Params:** Filtros de período, empresa, departamento, cargo, etc.

### 5. Estatísticas Gerais
- **GET /rh/estatisticas/gerais**
- **Descrição:** Estatísticas gerais de RH (headcount, médias, etc).
- **Query Params:** Filtros opcionais.

### 6. Score de Risco de Evasão
- **GET /rh/risco/evasao**
- **Descrição:** Score de risco de evasão de funcionários.
- **Query Params:** Filtros de risco (ver RiscoEvasaoDto).

### 7. Custo Real de Rescisão
- **GET /rh/custo/rescisao**
- **Descrição:** Cálculo do custo real de rescisões.
- **Query Params:** Filtros de custo (ver CustoRescisaoDto).

### 8. Validação de Filtros
- **POST /rh/validar-filtros**
- **Descrição:** Valida filtros enviados pelo frontend.
- **Body:** RhFiltersDto

### 9. Endpoints em Desenvolvimento
- **GET /rh/resumo/turnover-departamento**
- **GET /rh/resumo/turnover-periodo**
- **GET /rh/tempo-empresa**
- **GET /rh/faixa-etaria**

---

## Filtros (RhFiltersDto)
- **dataInicio:** Data início do período (YYYY-MM-DD)
- **dataFim:** Data fim do período (YYYY-MM-DD)
- **codemp:** Código(s) da empresa (CSV)
- **coddep:** Código(s) do departamento (CSV)
- **codcargo:** Código(s) do cargo (CSV)
- **situacao:** Situação do funcionário (ativo, desligado, etc)
- Outros campos conforme documentação Swagger

---

## Exemplo de Requisição

```http
GET /rh/dashboard/executivo?dataInicio=2024-01-01&dataFim=2024-12-31&codemp=1,2,3
Authorization: Bearer <JWT_TOKEN>
```

---

## Observações
- Consulte a documentação Swagger em `/api` para detalhes de cada endpoint e exemplos de resposta.
- Todos os endpoints retornam dados prontos para dashboards e análises.
- Filtros são opcionais, mas melhoram a performance e precisão dos dados.
- Endpoints em desenvolvimento retornarão `{ message: 'Endpoint em desenvolvimento' }`.

---

## Referências
- [Swagger UI](http://localhost:3027/api)
- [DTOs de Filtros](src/modules/sankhya/rh/dto/rh-filters.dto.ts)
- [Service/Queries](src/modules/sankhya/rh/services/rh.service.ts)

---

> Para dúvidas ou novos requisitos, consulte a equipe backend ou abra uma issue.
