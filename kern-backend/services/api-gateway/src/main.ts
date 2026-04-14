import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerService, HttpLoggerMiddleware } from '@kern/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  // Access the underlying Express instance to register middleware
  const express = app.getHttpAdapter().getInstance();

  // Attach the Pino Logger to intercept all incoming requests
  const pinoLogger = app.get(PinoLoggerService);
  const loggerMiddleware = new HttpLoggerMiddleware(pinoLogger);
  express.use((req, res, next) => loggerMiddleware.use(req, res, next));

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
}
bootstrap();
