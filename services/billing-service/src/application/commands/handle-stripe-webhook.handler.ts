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
      case 'customer.subscription.created':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
    }
  }

  private async handleCheckoutCompleted(session: any) {
    const organizationId = session.client_reference_id;
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    if (!organizationId) {
      console.error('Missing client_reference_id in Stripe session', session.id);
      return;
    }

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
      const periodEnd = Number(stripeSub.current_period_end);
      subscription.stripeCurrentPeriodEnd = !isNaN(periodEnd) && periodEnd > 0 ? new Date(periodEnd * 1000) : null;
      subscription.stripeCancelAtPeriodEnd = stripeSub.cancel_at_period_end ?? false;

      // Handle status mapping
      const statusMap: Record<string, SubscriptionStatus> = {
        active: SubscriptionStatus.ACTIVE,
        trialing: SubscriptionStatus.TRIALING,
        past_due: SubscriptionStatus.PAST_DUE,
        canceled: SubscriptionStatus.CANCELED,
        unpaid: SubscriptionStatus.CANCELED,
      };
      subscription.status = statusMap[stripeSub.status] || subscription.status;

      // Update plan if the price ID changed
      const priceId = stripeSub.items.data[0].price.id;
      const plan = await this.planRepository.findByStripePriceId(priceId);

      if (plan && plan.id !== subscription.planId) {
        subscription.changePlan(plan.id, plan.monthlyTokenLimit);
      }

      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleInvoicePaid(invoice: any) {
    if (!invoice.subscription) return;

    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(invoice.subscription);
    if (subscription) {
      subscription.tokensUsed = 0;
      subscription.status = SubscriptionStatus.ACTIVE;
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handlePaymentFailed(invoice: any) {
    if (!invoice.subscription) return;

    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(invoice.subscription);
    if (subscription) {
      subscription.status = SubscriptionStatus.PAST_DUE;
      await this.subscriptionRepository.save(subscription);
    }
  }
}
