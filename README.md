# 🚀 SOAT Tech Challenge — Microserviço de Produtos

Microserviço responsável **exclusivamente pela gestão de Produtos** do sistema de autoatendimento da lanchonete. Este repositório **não é mais um monolito**: todos os outros domínios (orders, customers, payments, auth, etc.) foram removidos.

A aplicação segue **Clean Architecture**, é **100% cloud‑native** e utiliza **AWS DynamoDB** como banco de dados.

---

## 🎯 Escopo do Microserviço

Este serviço é responsável apenas por:

* ✅ Cadastro de produtos
* ✅ Consulta de produtos
* ✅ Atualização de produtos
* ✅ Exclusão de produtos

---

## 🧱 Stack Tecnológica

* **Node.js 20.x**
* **NestJS**
* **TypeScript**
* **AWS DynamoDB**
* **AWS EKS (Kubernetes)**
* **Docker + ECR**
* **GitHub Actions (CI/CD)**
* **Swagger (OpenAPI 3)**

---

## 🏗️ Arquitetura Cloud‑Native

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS CLOUD                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  EKS Cluster                                        │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Deployment: fiap-soat-application-produtos  │   │    │
│  │  │  - NestJS                                    │   │    │
│  │  │  - Port: 3000                                │   │    │
│  │  │  - HPA: 1–3 replicas                         │   │    │
│  │  │  - Health: /health                           │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│              ┌──────────────────────────────┐               │
│              │        DynamoDB              │               │
│              │   Table: products            │               │
│              └──────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deploy e Execução

### ⚠️ Importante

Este microserviço **não possui modo monolítico nem dependências locais**. Ele é projetado para rodar em ambiente cloud.

### Pré‑requisitos

* AWS CLI configurado
* kubectl configurado
* Docker
* Cluster EKS ativo
* Tabelas DynamoDB criadas

---

## 📦 Build & Push da Imagem

```bash
# Build local
docker compose up --build
```
---

## 🧼 Health Check

```bash
GET /health
```

Resposta esperada:

```json
{ "status": "ok" }
```

---

## 📂 Clean Architecture (Ajustada ao Escopo)

```
src/
├── core/                     # Domínio + Casos de Uso
│   ├── products/
│   │   ├── entities/
│   │   ├── usecases/
│   │   │   ├── commands/
│   │   │   └── queries/
│   │   ├── gateways/
│   │   └── presenters/
│   ├── categories/
│   └── common/
│
├── external/                 # Infraestrutura
│   ├── api/                  # Controllers HTTP (NestJS)
│   ├── database/             # DynamoDB adapters
│   └── providers/
│
├── config/
├── app.module.ts
└── main.ts
```

### Princípios Mantidos

* Separação total entre domínio e infraestrutura
* CQRS (Commands / Queries)
* Domínio independente de AWS
* DynamoDB isolado por adapters

---

## 📊 Endpoints Disponíveis

### Produtos

* `GET /products`
* `GET /products/:id`
* `POST /products`
* `PATCH /products/:id`
* `DELETE /products/:id`

### Documentação

* `GET /docs` (Swagger)

---

## 🧪 Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

## 🔄 CI/CD

Pipeline automatizado com GitHub Actions:

1. Lint + Testes
2. Build da imagem
3. Push para ECR
4. Deploy no EKS
5. Rollout monitorado

---

## 🧠 Observações Importantes

* Este repositório **não depende** de outros microserviços
* Comunicação entre serviços deve ocorrer via API ou eventos
* DynamoDB elimina necessidade de migrações
* Escalável horizontalmente via HPA

---

## 📅 Última Atualização

Janeiro 2026 — Refatoração para Microserviço de Produtos

---
