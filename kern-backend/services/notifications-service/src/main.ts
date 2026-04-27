import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.enableCors();
  app.setGlobalPrefix('/api/v1', { exclude: ['/health'] });

  // Connect to RabbitMQ via the shared Docker network
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://kern:kernpass@rabbitmq:5672'],
      queue: 'notifications_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3006;
  await app.listen(port);
  console.log(`[notifications-service] 🚀  Ready on http://localhost:${port}`);
  console.log(`[notifications-service] 🐰  Listening to RabbitMQ events`);
}
bootstrap();
