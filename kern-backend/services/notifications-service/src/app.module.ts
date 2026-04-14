import { Controller, Get, Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';

// TODO: Add notifications logic here
// ...
@Controller()
class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get('health')
  check() {
    return { status: 'ok', service: 'notifications-service', timestamp: new Date().toISOString() };
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    this.logger.log(`🎉 Received 'user_created' event for user: ${data.email}. Sending welcome email...`);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DiscoveryClientModule,
    MetricsModule
  ],
  controllers: [AppController],
})
export class AppModule { }
