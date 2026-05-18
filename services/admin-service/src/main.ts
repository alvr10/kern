import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  app.setGlobalPrefix('/api/v1', { exclude: ['/health'] });
  const port = process.env.ADMIN_PORT ?? 3009;
  await app.listen(port);
  console.log(`[admin-service] 🚀  Ready on http://localhost:${port}`);
}
bootstrap();
