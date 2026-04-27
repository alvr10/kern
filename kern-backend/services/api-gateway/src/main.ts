import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware, ConsulService } from '@kern/shared';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';
import { jwtAuthMiddleware } from './middleware/jwt-auth.middleware';

const SERVICES = [
  'organizations-service',
  'projects-service',
  'content-service',
  'ai-service',
  'notifications-service',
  'social-service',
  'billing-service',
  'admin-service',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.enableCors();

  const express = app.getHttpAdapter().getInstance();

  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  express.use((req, res, next) => loggerMiddleware.use(req, res, next));

  // Verify Supabase JWT on every protected route; inject x-user-id header
  express.use(jwtAuthMiddleware);

  // Serve each service's openapi.yaml as a static file
  SERVICES.forEach(service => {
    const yamlPath = resolve(__dirname, '..', '..', '..', 'services', service, 'openapi.yaml');
    express.get(`/api/docs/yaml/${service}`, (_req: any, res: any) => {
      res.sendFile(yamlPath);
    });
  });

  // Mount Swagger UI with multi-spec dropdown (no compiled document needed)
  const swaggerOptions: swaggerUi.SwaggerUiOptions = {
    swaggerOptions: {
      urls: SERVICES.map(service => ({
        url: `/api/docs/yaml/${service}`,
        name: service.replace('-service', '').toUpperCase(),
      })),
      urls_primary_name: 'AUTH',
    },
    explorer: true,
  };

  express.use('/api/docs', swaggerUi.serve);
  express.get('/api/docs', swaggerUi.setup(undefined, swaggerOptions));

  // Dynamic Proxy Routing
  const consulService = app.get(ConsulService);
  const serviceIndices = new Map<string, number>();

  const ROUTE_TO_SERVICE: Record<string, string> = {
    '/api/v1/organizations': 'organizations-service',
    '/api/v1/projects': 'projects-service',
    '/api/v1/content': 'content-service',
    '/api/v1/social': 'social-service',
    '/api/v1/notifications': 'notifications-service',
    '/api/v1/billing': 'billing-service',
    '/api/v1/ai': 'ai-service',
    '/api/v1/admin': 'admin-service',
  };

  express.use(async (req: any, res: any, next: any) => {
    const prefix = Object.keys(ROUTE_TO_SERVICE).find((p) => req.path.startsWith(p));
    if (!prefix) return next();

    const serviceName = ROUTE_TO_SERVICE[prefix];

    try {
      const instances = await consulService.resolve(serviceName);
      if (!instances?.length) {
        return res.status(503).json({ error: `${serviceName} unavailable` });
      }

      const currentIndex = serviceIndices.get(serviceName) || 0;
      const instance = instances[currentIndex % instances.length];
      serviceIndices.set(serviceName, (currentIndex + 1) % instances.length);

      const target = `http://${instance.host}:${instance.port}`;

      createProxyMiddleware({
        target,
        changeOrigin: true,
        on: {
          error: (err, _req, res: any) => {
            res.status(502).json({ error: 'Service unavailable', detail: err.message });
          },
        },
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);
  console.log(`██╗  ██╗███████╗██████╗ ███╗   ██╗
██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
█████╔╝ █████╗  ██████╔╝██╔██╗ ██║
██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██║  ██╗███████╗██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
                                  `);
  console.log('[api-gateway] 🚀  Listening on http://localhost:3000');
  console.log('[api-gateway] 📄  API Docs available at http://localhost:3000/api/docs');
}
bootstrap();
