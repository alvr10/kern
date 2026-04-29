import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelSubscriptionCommand } from './cancel-subscription.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { StripeClient } from '../../infrastructure/external-api/stripe.client';

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler implements ICommandHandler<CancelSubscriptionCommand> {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly stripeClient: StripeClient,
  ) {}

  async execute(command: CancelSubscriptionCommand): Promise<void> {
    const subscription = await this.subscriptionRepository.findByOrganizationId(command.organizationId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found for this organization');
    }

    if (subscription.stripeSubscriptionId) {
      await this.stripeClient.cancelSubscription(subscription.stripeSubscriptionId);
    }

    subscription.cancel();
    await this.subscriptionRepository.save(subscription);
  }
}
