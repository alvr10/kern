import { Controller, Get, Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DiscoveryClientModule } from '@kern/shared';

// TODO: Add notifications logic here
// Suggested modules:
//   - NotificationsModule (in-app notifications via Mongoose)
//   - EmailModule         (send emails via Resend SDK)

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
    // Here you would call Resend API to actually send the email asynchronously!
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
  ],
  controllers: [AppController],
})
export class AppModule { }
