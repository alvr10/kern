import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
    rawBody: true,
  });
  app.enableCors();
  app.setGlobalPrefix('/api/v1', { exclude: ['/health'] });

  // Connect to RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://kern:kernpass@rabbitmq:5672'],
      queue: 'billing_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3007;
  await app.listen(port);
  console.log(`[billing-service] 🚀  Ready on http://localhost:${port}`);
  console.log(`[billing-service] 🐰  Listening to RabbitMQ events`);
}
bootstrap();
