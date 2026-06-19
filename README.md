# KERN — Monorepo Empresarial Unificado

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-Hexagonal%20%2F%20DDD%20%2F%20Monorepo-orange.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20Supabase%20%7C%20Prisma%20%7C%20MongoDB-green.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

**KERN** es un ecosistema web y de microservicios altamente escalable y de nivel de producción, diseñado para la gestión de contenido de alto rendimiento, la automatización impulsada por IA y la orquestación de redes sociales. Este repositorio une tanto las aplicaciones web del frontend como los microservicios de dominio del backend bajo un único monorepo unificado.

---

## 🏛️ Estructura y Principios del Monorepo

Este proyecto opera bajo estrictos patrones de ingeniería de software:

- **Orquestación**: Gestionado por [Turborepo](https://turbo.build/) y [PNPM Workspaces](https://pnpm.io/workspaces).
- **Frontend**: Portal de inicio y panel de control (dashboard) en [Next.js](https://nextjs.org/) (`apps/web`).
- **Arquitectura del Backend**: Microservicios de NestJS que siguen la **Arquitectura Hexagonal** (Clean Architecture) con **Diseño Guiado por el Dominio (DDD)** y segregación de comandos y consultas (CQRS).
- **Arquitectura de Base de Datos**:
  - **Supabase / PostgreSQL**: Gestionado mediante aislamiento de cliente **Prisma** (`packages/database`).
  - **MongoDB**: Definición de esquemas mediante aislamiento de cliente **Mongoose**.
- **Descubrimiento de Servicios (Service Discovery)**: HashiCorp Consul.
- **Observabilidad**: Pila (Stack) LGTM de OpenTelemetry + Prometheus/Grafana.

---

## 📁 Diseño del Repositorio (Layout)

```text
kern/
├── apps/
│   ├── web/                    # Portal Web en Next.js 16 (Panel de control, incorporación / onboarding)
│   └── api-gateway/            # API Gateway en NestJS (Entrada pública, limitación de tasa / rate limiting)
├── services/
│   ├── organizations-service/  # Gestión de equipos, roles y espacios de trabajo (Postgres)
│   ├── content-service/        # Elementos de contenido, tableros Kanban y calendarios (MongoDB)
│   ├── social-service/         # Cuentas sociales y motor de publicación (MongoDB)
│   ├── ai-service/             # Motor de IA Gemini y cuotas de tokens (MongoDB)
│   ├── billing-service/        # Cumplimiento de pagos con Stripe (Postgres)
│   ├── notifications-service/  # Motor de notificaciones en la aplicación, correo electrónico y push (MongoDB)
│   └── admin-service/          # Métricas del panel administrativo y supervisión (Base de datos dual)
├── packages/
│   ├── core-backend/           # Protectores (guards), filtros, interceptores y utilidades compartidas de NestJS
│   ├── database/               # Esquema centralizado de Prisma y clientes de PostgreSQL
│   ├── config-typescript/      # Definiciones estrictas y compartidas de TSConfig
│   ├── config-eslint/          # Reglas compartidas de Flat ESLint
│   └── config-prettier/        # Definiciones de formateo global compartidas
└── infra/                      # Archivos de configuración de Consul, RabbitMQ y Alloy
```

---

## 🗺️ Mapa de Puertos de Servicios

| Objetivo                | Ubicación                        | Puerto          | Base de Datos       | Responsabilidad Primaria                                            |
| :---------------------- | :------------------------------- | :-------------- | :------------------ | :------------------------------------------------------------------ |
| `web`                   | `apps/web`                       | **8001** (Prod) | API de Supabase     | Interfaz de usuario del panel de control web                        |
| `api-gateway`           | `apps/api-gateway`               | **8000**        | —                   | Puerta de enlace pública única, proxy HTTP, limitación de tasa      |
| `organizations-service` | `services/organizations-service` | 8002            | PostgreSQL (Prisma) | Equipos, miembros, roles, espacios de trabajo                       |
| `content-service`       | `services/content-service`       | 8004            | MongoDB (Mongoose)  | Curación de contenido, tableros Kanban, agendas                     |
| `social-service`        | `services/social-service`        | 8005            | MongoDB (Mongoose)  | Integración de API con redes sociales                               |
| `ai-service`            | `services/ai-service`            | 8006            | MongoDB (Mongoose)  | Validación de prompts de Gemini 3.1 Flash Lite, auditoría de uso    |
| `billing-service`       | `services/billing-service`       | 8007            | PostgreSQL (Prisma) | Planes de Stripe, suscripciones y facturación                       |
| `notifications-service` | `services/notifications-service` | 8008            | MongoDB (Mongoose)  | Motor de notificaciones en la aplicación, correo electrónico y push |
| `admin-service`         | `services/admin-service`         | 8009            | PostgreSQL + Mongo  | Métricas del panel administrativo, anulación del sistema            |

---

## 🚀 Primeros Pasos

### 1. Requisitos Previos

- Docker y Docker Compose
- Node.js 22+ y PNPM (v9 o superior)

### 2. Configuración del Entorno

Cree un archivo `.env` en la raíz y complete sus claves de Supabase, MongoDB, Stripe y Gemini:

```bash
cp .env.example .env
```

Cree un archivo `.env.local` dentro de la aplicación web para las configuraciones orientadas al navegador:

```bash
cp apps/web/.env.example apps/web/.env.local
```

---

## 🐳 Despliegue y Perfiles de Docker

Para equilibrar el desarrollo rápido y el despliegue completo, utilizamos **Perfiles de Docker Compose** para controlar fácilmente la compilación del frontend en Next.js.

### Opción A: Modo de Desarrollo Estándar (Recomendado) ⚡

Ejecute todos los microservicios del backend, pasarelas de enlace (gateways), mallas de servicio (service meshes) y bases de datos dentro de Docker, mientras ejecuta el frontend de Next.js localmente (lo que ofrece recargas rápidas en menos de un segundo):

```bash
# Iniciar todos los microservicios y bases de datos del backend
docker compose up -d

# Iniciar la aplicación web de Next.js localmente
pnpm --filter @kern/web dev
```

### Opción B: Compilación de Contenedores Full-Stack (Todo en Uno) 📦

Compile y ponga en marcha toda la plataforma, incluido el contenedor de Next.js, dentro de Docker:

```bash
# Forzar a Docker a compilar y ejecutar TODO, incluido el contenedor de Next.js
docker compose --profile frontend up --build -d
```

---

## 🛠️ Operaciones del Monorepo

Las operaciones estándar del desarrollador se pueden orquestar directamente desde la raíz del monorepo:

```bash
# Ejecutar toda la plataforma localmente en modo de desarrollo
pnpm dev

# Compilar todas las aplicaciones y servicios dentro del monorepo
pnpm build

# Ejecutar reglas de linting en todo el espacio de trabajo (Flat Config)
pnpm lint

# Formatear automáticamente todos los archivos usando Prettier
pnpm format
```

---

## 🛡️ Licencia

Este proyecto está bajo la [Licencia de Software Propietario](LICENSE).
