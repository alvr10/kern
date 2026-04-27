import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSubscriptionQuery } from './get-subscription.query';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { Inject, NotFoundException } from '@nestjs/common';

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler implements IQueryHandler<GetSubscriptionQuery> {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(query: GetSubscriptionQuery): Promise<any> {
    const subscription = await this.subscriptionRepository.findByOrganizationId(query.organizationId);
    if (!subscription) {
      throw new NotFoundException('No subscription found for this organization');
    }
    return subscription;
  }
}
