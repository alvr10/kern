# ADR 001: Arquitectura Base del Ecosistema de Microservicios Kern

**Fecha:** Abril 2026  
**Estado:** Aceptado  
**Autores:** Equipo de Arquitectura Kern

## Contexto

Kern es un gestor de contenido de redes sociales para equipos de marketing. Con tablero kanban, organizaciones y proyectos, busca ser una herramienta colaborativa para la creación de contenido. La IA está integrada para generar contenido y sugerir mejoras. Y el tablero kanban permite gestionar los posts. Para soportar esta visión, necesitamos una arquitectura escalable, mantenible y alineada con los principios de diseño de software rigurosos.

## Decisión Técnica

Se ha diseñado e implementado una arquitectura orientada a microservicios con las siguientes características técnicas clave, en estricto cumplimiento del protocolo de desarrollo de agentes KERN:

### 1. Framework y Lenguaje

- **Stack:** Node.js con TypeScript (Modo Estricto, sin uso de `any` o `@ts-ignore`).
- **Framework Principal:** **NestJS**. Proporciona una base sólida con inyección de dependencias modular que se adapta perfectamente a la Arquitectura Hexagonal.

### 2. Estilo Arquitectónico (Clean Architecture y DDD Estricto)

- **Arquitectura Hexagonal (Clean Architecture):** Cada microservicio sigue una estructura estricta de cuatro capas separadas (`domain/`, `application/`, `infrastructure/`, `presentation/`).
- **Domain-Driven Design (DDD):** La lógica central de negocio reside íntegramente en la capa `domain/` mediante entidades, _value objects_, repositorios (solo interfaces) y eventos de dominio en TypeScript puro, sin dependencias externas.
- **CQRS (Command Query Responsibility Segregation):** Se emplea un patrón estricto CQRS. Los _Commands_ modifican el estado (handlers que devuelven `void` o identificadores), y las _Queries_ recuperan el estado (devolviendo DTOs optimizados para la capa de persistencia).

### 3. Base de Datos y Persistencia

- **Tecnología Relacional:** PostgreSQL (ej. Supabase) gestionado a través de **Prisma**. Ideal para usuarios, organizaciones y la gestión relacional.
- **Tecnología NoSQL (Documentos):** MongoDB gestionado a través de **Mongoose** para datos flexibles, tales como el contenido generado por IA, metadatos variables de redes sociales o esquemas dinámicos de posts.
- **Agnosticismo del Dominio:** Las entidades de dominio son completamente agnósticas a la base de datos. Es obligatorio el uso de **Mappers** en la capa de infraestructura (`infrastructure/database/mappers/`) para transformar los modelos de base de datos (Prisma/Mongoose) a entidades de dominio y viceversa.

### 4. Comunicación entre Servicios

- **Síncrona:** API REST (y resolutores GraphQL si aplica), expuestos en la capa de presentación (`presentation/controllers/`).
- **Asíncrona (Eventos):** Uso de _Domain Events_ para disparar efectos secundarios en otras capas o servicios. Integración con brókers de mensajería (RabbitMQ/Kafka) a través de _consumers_ (`presentation/consumers/`).

### 5. Lógica Compartida y Observabilidad

- **Paquetes Compartidos:** Toda la lógica común, utilidades, filtros de excepciones globales e interceptores residen en el paquete interno `@kern/shared`. Si un patrón se repite en 3+ servicios, se migrará allí.
- **Observabilidad Integral:**
  - Sistema de _logging_ centralizado a través de un _logger_ personalizado en `@kern/shared`.
  - Trazabilidad distribuida (OpenTelemetry).
  - Puntos de control (_Health checks_) obligatorios implementados en la ruta `GET /health` para cada servicio, que deben retornar `200 OK`.

## Consecuencias

### Positivas

- **Alta Mantenibilidad e Independencia:** La estricta separación de la capa `domain/` asegura que las reglas de negocio no se vean afectadas por cambios en el framework o cambios en los sistemas de base de datos (Prisma o Mongoose).
- **Escalabilidad Optimizada:** CQRS nos permite escalar y optimizar las consultas (ej. visualizar rápidamente el tablero Kanban) y las escrituras (ej. el pesado procesamiento y autoguardado de la IA de contenido) de manera independiente.
- **Consistencia Tecnológica:** Al estandarizar la inyección de dependencias a través de interfaces y un control de errores mediante un "Global Exception Filter", todos los microservicios son predecibles y homógeneos.

### Negativas / Riesgos Asumidos

- **Curva de Aprendizaje y Esfuerzo Inicial:** Implementar arquitecturas hexagonales con DDD y CQRS requiere una cantidad significativa de código inicial (_Mappers_, _DTOs_, _Handlers_, Interfaces) lo que puede reducir la velocidad de desarrollo en etapas tempranas.
- **Sobrecarga en Dominio Distribuido:** Administrar múltiples microservicios con colas de mensajería incrementa la complejidad del sistema global y de despliegue, requiriendo automatizaciones maduras y perfiles con entendimiento holístico del ecosistema.
