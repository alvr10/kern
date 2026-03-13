import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();
  const port = process.env.PORT ?? 3008;
  await app.listen(port);
  console.log(`[ai-service] 🚀  Ready on http://localhost:${port}`);
}
bootstrap();
