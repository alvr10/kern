# KERN — Unified Enterprise Monorepo

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-Hexagonal%20%2F%20DDD%20%2F%20Monorepo-orange.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20Supabase%20%7C%20Prisma%20%7C%20MongoDB-green.svg)

**KERN** is a production-grade, highly scalable microservices and web ecosystem designed for high-performance content management, AI-driven automation, and social media orchestration. This repository unites both the frontend web applications and backend domain microservices under a single unified monorepo.

---

## 🏛️ Monorepo Structure & Principles

This project operates under strict software engineering patterns:

- **Orchestration**: Managed by [Turborepo](https://turbo.build/) and [PNPM Workspaces](https://pnpm.io/workspaces).
- **Frontend**: [Next.js](https://nextjs.org/) dashboard and landing portals (`apps/web`).
- **Backend Architecture**: NestJS microservices following **Hexagonal Architecture** (Clean Architecture) with **Domain-Driven Design (DDD)** and command-query separation (CQRS).
- **Database Architecture**:
  - **Supabase / PostgreSQL**: Managed via **Prisma** client isolation (`packages/database`).
  - **MongoDB**: Schema definition via **Mongoose** client isolation.
- **Service Discovery**: HashiCorp Consul.
- **Observability**: OpenTelemetry + Prometheus/Grafana LGTM Stack.

---

## 📁 Repository Layout

```text
kern/
├── apps/
│   ├── web/                    # Next.js 16 Web Portal (Dashboard, Onboarding)
│   └── api-gateway/            # NestJS API Gateway (Public Entry, Rate Limiting)
├── services/
│   ├── organizations-service/  # Teams, Roles & Workspace Management (Postgres)
│   ├── content-service/        # Content Pieces, Kanban & Calendars (MongoDB)
│   ├── social-service/         # Social accounts & publishing engine (MongoDB)
│   ├── ai-service/             # Gemini AI Engine & Token Quotas (MongoDB)
│   ├── billing-service/        # Stripe payment fulfillment (Postgres)
│   ├── notifications-service/  # Multi-channel alerts (MongoDB)
│   └── admin-service/          # Platform Analytics & Oversight (Dual DB)
├── packages/
│   ├── core-backend/           # Shared NestJS guards, filters, interceptors, and utils
│   ├── database/               # Centralized Prisma Schema and PostgreSQL clients
│   ├── config-typescript/      # Shared strict TSConfig definitions
│   ├── config-eslint/          # Shared Flat ESLint Rules
│   └── config-prettier/        # Shared global formatting definitions
└── infra/                      # Consul, RabbitMQ, Alloy config files
```

---

## 🗺️ Service Ports Map

| Target                  | Location                         | Port            | Database            | Primary Responsibility                           |
| :---------------------- | :------------------------------- | :-------------- | :------------------ | :----------------------------------------------- |
| `web`                   | `apps/web`                       | **3001** (Prod) | Supabase API        | Frontend Dashboard User Interface                |
| `api-gateway`           | `apps/api-gateway`               | **3000**        | —                   | Single public gateway, HTTP proxy, Rate Limiting |
| `organizations-service` | `services/organizations-service` | 3002            | PostgreSQL (Prisma) | Teams, Members, Roles, Workspaces                |
| `content-service`       | `services/content-service`       | 3004            | MongoDB (Mongoose)  | Content curation, Kanban boards, schedules       |
| `social-service`        | `services/social-service`        | 3005            | MongoDB (Mongoose)  | API integration to social networks               |
| `ai-service`            | `services/ai-service`            | 3006            | MongoDB (Mongoose)  | Gemini 1.5 prompt validation, usage auditing     |
| `billing-service`       | `services/billing-service`       | 3007            | PostgreSQL (Prisma) | Stripe Plans, Subscriptions & Invoicing          |
| `notifications-service` | `services/notifications-service` | 3008            | MongoDB (Mongoose)  | In-app, Email & Push notification engine         |
| `admin-service`         | `services/admin-service`         | 3009            | PostgreSQL + Mongo  | Administrative panel metrics, system override    |

---

## 🚀 Getting Started

### 1. Prerequisites

- Docker & Docker Compose
- Node.js 22+ & PNPM (v9+)

### 2. Environment Setup

Create a `.env` file at the root and fill in your Supabase, MongoDB, Stripe, and Gemini keys:

```bash
cp .env.example .env
```

Create a `.env.local` inside the web app for browser-facing configurations:

```bash
cp apps/web/.env.example apps/web/.env.local
```

---

## 🐳 Docker Deployment & Profiles

To balance rapid development and comprehensive deployment, we use **Docker Compose Profiles** to easily control the Next.js frontend build.

### Option A: Standard Dev Mode (Recommended) ⚡

Run all backend microservices, gateways, service meshes, and databases inside Docker, while running the Next.js frontend locally (which features fast, sub-second hot-reloads):

```bash
# Start all backend microservices & databases
docker-compose up -d

# Start the Next.js web application locally
pnpm --filter @kern/web dev
```

### Option B: Full-Stack Container Build (All-In-One) 📦

Build and spin up the entire platform—including the Next.js container—inside Docker:

```bash
# Force Docker to build and run EVERYTHING including the Next.js container
docker-compose --profile frontend up --build -d
```

---

## 🛠️ Monorepo Operations

Standard developer operations can be orchestrated directly from the monorepo root:

```bash
# Run the entire platform locally in development mode
pnpm run dev

# Compile all applications and services inside the monorepo
pnpm run build

# Run linting rules workspace-wide (Flat Config)
pnpm run lint

# Auto-format all files using Prettier
pnpm run format
```

---

## 🛡️ License

Proprietary — All rights reserved.
