# KERN — Agent Coding Protocol

This document defines the architectural standards, coding patterns, and engineering principles for the **KERN** microservices ecosystem. All agents MUST adhere to these rules without exception to ensure production-grade, zero-debt TypeScript architecture.

## 1. Core Principles

- **Framework**: NestJS (latest stable).
- **Architecture**: Hexagonal / Clean Architecture.
- **DDD**: Strict Domain-Driven Design components.
- **CQRS**: Command Query Responsibility Segregation.
- **Standards**: SOLID, DRY, KISS, and YAGNI.
- **Naming**: `kebab-case` for all files and directories.

---

## 2. Project Structure (Per Service)

Each microservice in `services/*` must follow this layered structure:

```text
src/
├── domain/                # Core business logic (Pure TS, no dependencies)
│   ├── entities/          # Domain entities
│   ├── value-objects/     # Immutable value objects
│   ├── repositories/      # Interface definitions only
│   ├── events/            # Domain events
│   └── exceptions/        # Domain-specific errors
├── application/           # Orchestration layer
│   ├── commands/          # Write operations (handlers + definitions)
│   ├── queries/           # Read operations (handlers + definitions)
│   ├── dtos/              # Data Transfer Objects
│   └── services/          # Application services
├── infrastructure/        # Framework/External implementations
│   ├── database/          # Persistence (Prisma, Mongoose)
│   │   ├── mappers/       # Domain <-> Persistence conversion
│   │   ├── repositories/  # Implementation of domain interfaces
│   │   └── schemas/       # DB specific schemas (Mongo)
│   └── external-api/      # Clients for other services/third-party
└── presentation/          # Entry points
    ├── controllers/       # REST endpoints
    ├── resolvers/         # GraphQL (if applicable)
    └── consumers/         # Message broker listeners (RabbitMQ/Kafka)
```

---

## 3. Technology Stack & Persistence

### TypeScript Standards
- **Strict Mode**: Mandatory. No `any`, no `@ts-ignore`.
- **Typing**: Use `interface` for contracts and `type` for unions/intersections.
- **Returns**: Explicit return types for all public methods and functions.

### Databases
- **Relational (Supabase/PostgreSQL)**: Use **Prisma**.
- **NoSQL (Document)**: Use **Mongoose**.
- **Rule**: Domain entities must remain database-agnostic. Use **Mappers** in the infrastructure layer to transform DB models into Domain entities.

---

## 4. CQRS Implementation

- **Commands**: Modify state. Should be handled by handlers that return `Promise<void>` or a simple identifier.
- **Queries**: Retrieve state. Should be optimized for reads, returning DTOs directly from the persistence layer when possible to avoid overhead.
- **Events**: Use Domain Events to trigger side effects across layers or services.

---

## 5. Coding Style & Patterns

- **Immutability**: Prefer `readonly` properties and functional methods (`map`, `filter`, `reduce`).
- **Dependency Injection**: Use NestJS DI. Always inject interfaces (via symbols or tokens) to decoupling domain from infrastructure.
- **Validation**: Use `class-validator` and `class-transformer` in DTOs.
- **Error Handling**: Use a Global Exception Filter. Throw Domain Exceptions in the core and map them to HTTP codes in the presentation layer.

---

## 6. Shared Logic

- Common utilities, filters, interceptors, and observability logic reside in `packages/shared`.
- Avoid duplication. If a pattern is used by 3+ services, move it to `@kern/shared`.

---

## 7. Operational Excellence

- **Logging**: Use the custom logger from `@kern/shared`.
- **Tracing**: Follow OpenTelemetry patterns.
- **Health Checks**: Every service must have a GET `/health` endpoint returning `200 OK`.

---

## 8. Agent Workflow

1.  **Analyze**: Understand the impact on Domain vs Infrastructure.
2.  **Define Protocol**: Start by defining DTOs, Commands, and Domain Interfaces.
3.  **Implement Domain**: Write the core logic first.
4.  **Implement Infra**: Connect to DB/External services.
5.  **Expose**: Add the Controller/Consumer.
6.  **Verify**: Ensure types are sound and naming is kebab-case.
