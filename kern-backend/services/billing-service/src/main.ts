import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.enableCors();
  const port = process.env.PORT ?? 3007;
  await app.listen(port);
  console.log(`[billing-service] 🚀  Ready on http://localhost:${port}`);
}
bootstrap();
