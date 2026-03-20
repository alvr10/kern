import { Controller, Get, Post, Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';

@Controller()
class AppController {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private readonly rabbitClient: ClientProxy) { }

  @Get('health')
  check() {
    return { status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() };
  }

  @Post('register')
  mockRegister() {
    const mockUser = { id: 'usr_123', email: 'hello@kern.app', name: 'Alvaro' };

    // Auth service does its own database logic here...

    // Then shouting into the void for other services to react asynchronously
    this.rabbitClient.emit('user_created', mockUser);

    return {
      message: 'User explicitly registered!',
      user: mockUser,
      event: 'user_created event fired into RabbitMQ'
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://kern:kernpass@rabbitmq:5672'],
          queue: 'notifications_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule { }
