# KERN — Microservices Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-Hexagonal%20%2F%20DDD-orange.svg)
![Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Prisma%20%7C%20MongoDB-green.svg)

**KERN** is a production-grade, highly scalable microservices ecosystem designed for high-performance content management, AI-driven automation, and social media orchestration.

---

## 🏗️ Architecture & Principles

This project follows strict engineering standards defined in `AGENTS.md`:

- **Framework**: [NestJS](https://nestjs.com/) (latest stable).
- **Pattern**: Hexagonal Architecture (Clean Architecture) with Domain-Driven Design (DDD).
- **Communication**:
  - **Synchronous**: REST/GraphQL via internal HTTP (Consul Service Discovery).
  - **Asynchronous**: RabbitMQ for event-driven side effects.
- **CQRS**: Strict separation of Command and Query responsibilities.
- **Observability**: Full tracing with OpenTelemetry (Alloy) and metrics with Prometheus/Grafana.

---

## 🗺️ Service Map

| Service                 | Port     | Primary Database    | Responsibility                              |
| :---------------------- | :------- | :------------------ | :------------------------------------------ |
| `api-gateway`           | **3000** | —                   | Public Entry Point, Proxying, Rate Limiting |
| `organizations-service` | 3002     | PostgreSQL (Prisma) | Teams, Roles, and Workspace Management      |
| `content-service`       | 3004     | MongoDB (Mongoose)  | Content Pieces, Kanban, and Calendar        |
| `social-service`        | 3005     | MongoDB (Mongoose)  | Account connection & Automated Publishing   |
| `ai-service`            | 3006     | MongoDB (Mongoose)  | Gemini 1.5 Flash Integration & Token Quotas |
| `billing-service`       | 3007     | PostgreSQL (Prisma) | Stripe Subscriptions & Plan Management      |
| `notifications-service` | 3008     | MongoDB (Mongoose)  | Multi-channel Alerts (Email, Push)          |
| `admin-service`         | **3009** | Both                | Platform Analytics & Global Oversight       |

---

## 🛠️ Tech Stack

- **Languages**: TypeScript (Strict Mode).
- **Persistence**:
  - **PostgreSQL**: Relational data (Organizations, Billing) via **Prisma**.
  - **MongoDB**: Document data (Content, Social, AI Logs) via **Mongoose**.
  - **Redis**: Caching and distributed locking.
- **Messaging**: RabbitMQ.
- **Infra**:
  - **Service Mesh**: HashiCorp Consul.
  - **Storage**: Minio (S3 Compatible).
  - **Observability**: Grafana Alloy + OpenTelemetry.
- **External APIs**:
  - **Stripe**: Payment fulfillment.
  - **Gemini**: GenAI text generation.

---

## 🚀 Getting Started

### 1. Prerequisites

- Docker & Docker Compose.
- Node.js 20+ (for local development).

### 2. Configuration

Copy the environment template and fill in your keys (Stripe, Gemini, Supabase):

```bash
cp .env.example .env
```

### 3. Development Commands

The root `package.json` contains orchestrated scripts for the entire monorepo:

```bash
# Boot the entire infrastructure + services
npm run up:d

# View real-time logs
npm run logs

# Format the entire codebase (Prettier)
npm run format

# Run platform-wide linting (ESLint v10 Flat Config)
npm run lint

# Check formatting/lint without fixing
npm run format:check
npm run lint:check
```

---

## 📁 Directory Structure

```text
kern-backend/
├── packages/
│   └── shared/           # Common utilities, interfaces, and decorators
├── services/
│   ├── api-gateway/      # Entry point
│   ├── [service-name]/   # Individual microservices
│   │   ├── src/
│   │   │   ├── domain/         # Pure Business Logic
│   │   │   ├── application/    # Command/Query Handlers
│   │   │   ├── infrastructure/ # DB Repositories, External Clients
│   │   │   └── presentation/   # REST Controllers
│   │   └── tsconfig.json
├── prisma/               # Shared PostgreSQL Schema
├── infra/                # Configuration for Consul, RabbitMQ, Alloy, etc.
└── docker-compose.yml    # Orchestration
```

---

## 🛡️ License

Proprietary — All rights reserved.
