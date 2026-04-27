import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { WebhooksController } from './presentation/controllers/webhooks.controller';
import { CreateCheckoutSessionHandler } from './application/commands/create-checkout-session.handler';
import { HandleStripeWebhookHandler } from './application/commands/handle-stripe-webhook.handler';
import { GetSubscriptionHandler } from './application/queries/get-subscription.handler';
import { StripeClient } from './infrastructure/external-api/stripe.client';
import { PLAN_REPOSITORY } from './domain/repositories/plan.repository';
import { PlanPrismaRepository } from './infrastructure/database/repositories/plan-prisma.repository';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/subscription.repository';
import { SubscriptionPrismaRepository } from './infrastructure/database/repositories/subscription-prisma.repository';
import { PrismaService } from './infrastructure/database/prisma.service';

const Handlers = [
  CreateCheckoutSessionHandler,
  HandleStripeWebhookHandler,
  GetSubscriptionHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [SubscriptionsController, WebhooksController],
  providers: [
    ...Handlers,
    StripeClient,
    PrismaService,
    {
      provide: PLAN_REPOSITORY,
      useClass: PlanPrismaRepository,
    },
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionPrismaRepository,
    },
  ],
})
export class BillingModule {}
