import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCheckoutSessionCommand } from './create-checkout-session.command';
import { StripeClient } from '../../infrastructure/external-api/stripe.client';
import { PLAN_REPOSITORY, PlanRepository } from '../../domain/repositories/plan.repository';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(CreateCheckoutSessionCommand)
export class CreateCheckoutSessionHandler implements ICommandHandler<CreateCheckoutSessionCommand> {
  constructor(
    private readonly stripeClient: StripeClient,
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(command: CreateCheckoutSessionCommand): Promise<{ checkoutUrl: string }> {
    const plan = await this.planRepository.findById(command.planId);
    if (!plan || !plan.stripePriceIdMonthly) {
      throw new NotFoundException('Plan not found or not available for subscription');
    }

    const subscription = await this.subscriptionRepository.findByOrganizationId(command.organizationId);

    const session = await this.stripeClient.createCheckoutSession({
      customerId: subscription?.stripeCustomerId || undefined,
      organizationId: command.organizationId,
      priceId: plan.stripePriceIdMonthly,
      successUrl: command.successUrl,
      cancelUrl: command.cancelUrl,
    });

    return { checkoutUrl: session.url! };
  }
}
