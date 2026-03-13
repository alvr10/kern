import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// TODO: Add notifications logic here
// Suggested modules:
//   - NotificationsModule (in-app notifications via Mongoose)
//   - EmailModule         (send emails via Resend SDK)

@Controller('/notifications/health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'notifications-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
  ],
  controllers: [HealthController],
})
export class AppModule {}
