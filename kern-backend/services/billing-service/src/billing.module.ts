import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { WebhooksController } from './presentation/controllers/webhooks.controller';
import { AiEventsConsumer } from './presentation/consumers/ai-events.consumer';
import { CreateCheckoutSessionHandler } from './application/commands/create-checkout-session.handler';
import { HandleStripeWebhookHandler } from './application/commands/handle-stripe-webhook.handler';
import { GetSubscriptionHandler } from './application/queries/get-subscription.handler';
import { DeductTokensHandler } from './application/commands/deduct-tokens.handler';
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
  DeductTokensHandler,
];

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'AI_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://kern:kernpass@rabbitmq:5672'],
          queue: 'ai_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [SubscriptionsController, WebhooksController, AiEventsConsumer],
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
