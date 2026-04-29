import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeductTokensCommand } from './deduct-tokens.command';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(DeductTokensCommand)
export class DeductTokensHandler implements ICommandHandler<DeductTokensCommand> {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(command: DeductTokensCommand): Promise<void> {
    const subscription = await this.subscriptionRepository.findByOrganizationId(command.organizationId);

    if (!subscription) {
      throw new NotFoundException(`Subscription for organization ${command.organizationId} not found`);
    }

    subscription.addUsage(command.tokens);
    await this.subscriptionRepository.save(subscription);
  }
}
