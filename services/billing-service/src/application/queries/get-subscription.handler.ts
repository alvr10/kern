import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSubscriptionQuery } from './get-subscription.query';
import { SUBSCRIPTION_REPOSITORY, SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { PLAN_REPOSITORY, PlanRepository } from '../../domain/repositories/plan.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Subscription, SubscriptionStatus } from '../../domain/entities/subscription.entity';
import { v4 as uuidv4 } from 'uuid';

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler implements IQueryHandler<GetSubscriptionQuery> {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(query: GetSubscriptionQuery): Promise<any> {
    const subscription = await this.subscriptionRepository.findByOrganizationId(query.organizationId);
    
    if (subscription) {
      return subscription;
    }

    // Lazy create a default "Free" subscription if none exists
    const freePlan = await this.planRepository.findBySlug('free');
    if (!freePlan) {
      throw new NotFoundException('No subscription found and default free plan not configured');
    }

    const newSubscription = new Subscription(
      uuidv4(),
      query.organizationId,
      freePlan.id,
      SubscriptionStatus.ACTIVE,
      0,
      freePlan.monthlyTokenLimit,
      null,
      null,
      null,
      false,
      new Date(),
      new Date(),
    );

    await this.subscriptionRepository.save(newSubscription);
    return newSubscription;
  }
}
