import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeductTokensCommand } from './deduct-tokens.command';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeductTokensCommand)
export class DeductTokensHandler implements ICommandHandler<DeductTokensCommand> {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject('AI_SERVICE')
    private readonly aiClient: ClientProxy,
  ) {}

  async execute(command: DeductTokensCommand): Promise<void> {
    const subscription = await this.subscriptionRepository.findByOrganizationId(command.organizationId);

    if (!subscription) {
      throw new NotFoundException(`Subscription for organization ${command.organizationId} not found`);
    }

    subscription.addUsage(command.tokens);
    await this.subscriptionRepository.save(subscription);

    // Sync MongoDB cache in AI Service
    this.aiClient.emit('billing.usage_updated', {
      organizationId: subscription.organizationId,
      tokensUsed: subscription.tokensUsed,
      tokensLimit: subscription.tokensLimit,
    });
  }
}
