import { Subscription as PrismaSubscription, SubscriptionStatus as PrismaStatus } from '@prisma/client';
import { Subscription, SubscriptionStatus } from '../../../domain/entities/subscription.entity';

export class SubscriptionMapper {
  static toDomain(prisma: PrismaSubscription): Subscription {
    return new Subscription(
      prisma.id,
      prisma.organizationId,
      prisma.planId,
      prisma.status as unknown as SubscriptionStatus,
      prisma.tokensUsed,
      prisma.tokensLimit,
      prisma.stripeCustomerId,
      prisma.stripeSubscriptionId,
      prisma.stripeCurrentPeriodEnd,
      prisma.stripeCancelAtPeriodEnd,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }

  static toPersistence(domain: Subscription): any {
    return {
      organizationId: domain.organizationId,
      planId: domain.planId,
      status: domain.status as unknown as PrismaStatus,
      tokensUsed: domain.tokensUsed,
      tokensLimit: domain.tokensLimit,
      stripeCustomerId: domain.stripeCustomerId,
      stripeSubscriptionId: domain.stripeSubscriptionId,
      stripeCurrentPeriodEnd: domain.stripeCurrentPeriodEnd,
      stripeCancelAtPeriodEnd: domain.stripeCancelAtPeriodEnd,
    };
  }
}
