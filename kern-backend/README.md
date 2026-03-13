# KERN Backend — Microservices

NestJS microservices deployed via Docker Compose.

## Architecture

| Service                 | Port     | Database          | Responsibility                                 |
| ----------------------- | -------- | ----------------- | ---------------------------------------------- |
| `api-gateway`           | **3000** | —                 | Public entry point, HTTP proxy to all services |
| `auth-service`          | 3001     | Supabase Postgres | Login, register, JWT via Supabase              |
| `organizations-service` | 3002     | Supabase Postgres | Orgs, members, invitations                     |
| `projects-service`      | 3003     | Supabase Postgres | Projects within orgs                           |
| `content-service`       | 3004     | MongoDB           | Content pieces, Kanban/Calendar                |
| `social-service`        | 3005     | MongoDB           | Social account connections, scheduled posts    |
| `notifications-service` | 3006     | MongoDB           | In-app notifications + email (Resend)          |
| `billing-service`       | 3007     | Supabase Postgres | Plans, subscriptions, Stripe webhooks          |
| `ai-service`            | 3008     | MongoDB           | AI generation + token tracking                 |
| `admin-service`         | **3009** | Both              | Admin panel APIs, analytics, moderation        |

> Only `api-gateway` (3000) and `admin-service` (3009) are exposed to the host.  
> All other services run inside the internal `kern-network`.

## Quick Start

```bash
# 1. Copy env and fill in secrets
cp .env.example .env

# 2. Boot everything
docker compose up --build

# 3. Verify all services are healthy
curl http://localhost:3000/health          # api-gateway
curl http://localhost:3000/auth/health     # auth-service (via gateway)
curl http://localhost:3000/content/health  # content-service (via gateway)
# ... same pattern for all services
curl http://localhost:3009/admin/health    # admin-service (direct)
```

## Directory Structure

```
kern-backend/
├── services/
│   ├── api-gateway/          # HTTP reverse proxy
│   ├── auth-service/         # Supabase auth
│   ├── organizations-service/
│   ├── projects-service/
│   ├── content-service/
│   ├── social-service/
│   ├── notifications-service/
│   ├── billing-service/
│   ├── ai-service/
│   └── admin-service/        # Admin panel APIs
├── packages/
│   └── shared/               # Common TypeScript types
├── prisma/
│   └── schema.prisma         # Shared Postgres schema
└── docker-compose.yml
```

Each service has its own `package.json`, `tsconfig.json`, `Dockerfile`, and `src/`.

## Implementing a Service

1. Open `services/<name>/src/app.module.ts`
2. Follow the `TODO` comments and add your NestJS modules
3. The health endpoint at `/<service-prefix>/health` is already wired up
4. For Prisma services: run `npx prisma generate --schema=../../prisma/schema.prisma`

## Key Env Variables

| Variable              | Used by                                       |
| --------------------- | --------------------------------------------- |
| `DATABASE_URL`        | auth, organizations, projects, billing, admin |
| `DIRECT_URL`          | same (Prisma migrations)                      |
| `SUPABASE_URL` + keys | auth                                          |
| `MONGODB_URI`         | content, social, notifications, ai, admin     |
| `RESEND_API_KEY`      | notifications                                 |
| `STRIPE_SECRET_KEY`   | billing                                       |
| `OPENAI_API_KEY`      | ai                                            |
| `ADMIN_SECRET`        | admin (super-admin guard)                     |
