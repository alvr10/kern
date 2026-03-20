import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';

// TODO: Add social integrations here
// Suggested modules:
//   - SocialAccountsModule  (OAuth connection & token storage via Mongoose)
//   - ScheduledPostsModule  (cron-based auto-publishing)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'social-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
    DiscoveryClientModule,
    MetricsModule,
  ],
  controllers: [HealthController],
})
 export class AppModule { }
