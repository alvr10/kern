import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';

// TODO: Add billing logic here
// Suggested modules:
//   - PlansModule          (GET /billing/plans — public plan list)
//   - SubscriptionsModule  (create/update subscriptions via Prisma)
//   - StripeWebhookModule  (handle Stripe events: payment success, cancellation)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'billing-service', timestamp: new Date().toISOString() };
  }
}

import { BillingModule } from './billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule,
    DiscoveryClientModule,
    MetricsModule,
    BillingModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
