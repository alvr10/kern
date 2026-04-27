import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HandleStripeWebhookCommand } from './handle-stripe-webhook.command';
import { StripeClient } from '../../infrastructure/external-api/stripe.client';
import { ConfigService } from '@nestjs/config';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { PLAN_REPOSITORY, PlanRepository } from '../../domain/repositories/plan.repository';
import { Inject, BadRequestException } from '@nestjs/common';
import { SubscriptionStatus } from '../../domain/entities/subscription.entity';

@CommandHandler(HandleStripeWebhookCommand)
export class HandleStripeWebhookHandler implements ICommandHandler<HandleStripeWebhookCommand> {
  constructor(
    private readonly stripeClient: StripeClient,
    private readonly configService: ConfigService,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(command: HandleStripeWebhookCommand): Promise<void> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = this.stripeClient.constructEvent(command.payload, command.signature, webhookSecret!);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
    }
  }

  private async handleCheckoutCompleted(session: any) {
    const organizationId = session.metadata.organizationId;
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    // In a real app, we'd fetch the subscription from Stripe to get the period end and plan
    // For simplicity, we'll assume we have the organizationId and can update it.
    const subscription = await this.subscriptionRepository.findByOrganizationId(organizationId);

    if (subscription) {
      subscription.activate(stripeSubscriptionId, stripeCustomerId, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleSubscriptionDeleted(stripeSub: any) {
    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(stripeSub.id);
    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELED;
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleSubscriptionUpdated(stripeSub: any) {
    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(stripeSub.id);
    if (subscription) {
      subscription.stripeCurrentPeriodEnd = new Date(stripeSub.current_period_end * 1000);
      subscription.stripeCancelAtPeriodEnd = stripeSub.cancel_at_period_end;
      await this.subscriptionRepository.save(subscription);
    }
  }
}
