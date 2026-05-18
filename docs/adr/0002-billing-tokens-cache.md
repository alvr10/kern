# ADR 0002: Facturación de Tokens Asíncrona y Caché de Uso Local

**Fecha:** Abril 2026  
**Estado:** Aceptado  
**Autores:** Equipo de Arquitectura KERN

## 1. Contexto

La generación por IA (Gemini) es una característica central de KERN. Cada generación consume tokens que deben facturarse contra el plan de suscripción de la organización.

Consultar la "Fuente de Verdad" (PostgreSQL en `billing-service`) de forma síncrona antes de cada solicitud de IA introduce una latencia significativa (~100ms+) y crea un acoplamiento fuerte. Si la base de datos de facturación está bajo carga o el servicio está caído, las funciones de IA quedarían no disponibles.

## 2. Decisión

Hemos implementado un **Caché Distribuido con Consistencia Eventual** utilizando los siguientes componentes:

1. **Almacén Autoritativo**: PostgreSQL (`billing-service`) sigue siendo la única fuente de verdad para todos los balances de suscripción.
2. **Caché Local**: `ai-service` mantiene una réplica de alto rendimiento del uso de tokens en **MongoDB**.
3. **Cumplimiento Optimista**: El `ai-service` verifica el caché de MongoDB para los límites _antes_ de llamar a la IA. Esta verificación es casi instantánea (<5ms).
4. **Deducción Asíncrona**: Después de una generación exitosa, `ai-service` emite un evento `ai.tokens_consumed` a través de **RabbitMQ**.
5. **Sincronización Bidireccional**:
   - `billing-service` procesa la deducción en PostgreSQL.
   - `billing-service` luego emite un evento `billing.usage_updated`.
   - `ai-service` consume este evento para "corregir" su caché de MongoDB con las cifras oficiales.

## 3. Consecuencias

### Pros

- **Rendimiento**: La generación de IA comienza de inmediato sin esperar bloqueos de base de datos entre servicios.
- **Disponibilidad**: Las funciones de IA permanecen operativas incluso durante breves caídas del `billing-service` (usando los límites cacheados).
- **Escalabilidad**: La base de datos de facturación no se ve saturada por solicitudes de generación de IA de alta frecuencia.

### Contras

- **Consistencia Eventual**: Un usuario podría técnicamente exceder su límite de tokens por un pequeño margen si dispara docenas de solicitudes simultáneamente antes de que regrese el primer evento de sincronización. Aceptamos esta "fuga" como un compromiso a cambio de una experiencia de usuario superior.
