import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware } from '@kern/shared';
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
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  const express = app.getHttpAdapter().getInstance();

  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  express.use((req, res, next) => loggerMiddleware.use(req, res, next));

  // Verify Supabase JWT on every protected route; inject x-user-id header
  express.use(jwtAuthMiddleware);

  // Serve each service's openapi.yaml as a static file
  SERVICES.forEach((service) => {
    const yamlPath = resolve(__dirname, '..', '..', '..', 'services', service, 'openapi.yaml');
    express.get(`/api/docs/yaml/${service}`, (_req: any, res: any) => {
      res.sendFile(yamlPath);
    });
  });

  // Mount Swagger UI with multi-spec dropdown (no compiled document needed)
  const swaggerOptions: swaggerUi.SwaggerUiOptions = {
    swaggerOptions: {
      urls: SERVICES.map((service) => ({
        url: `/api/docs/yaml/${service}`,
        name: service.replace('-service', '').toUpperCase(),
      })),
      urls_primary_name: 'AUTH',
    },
    explorer: true,
  };

  express.use('/api/docs', swaggerUi.serve);
  express.get('/api/docs', swaggerUi.setup(undefined, swaggerOptions));

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
