import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionMapper } from '../mappers/subscription.mapper';

@Injectable()
export class SubscriptionPrismaRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganizationId(organizationId: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { organizationId } });
    return sub ? SubscriptionMapper.toDomain(sub) : null;
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { stripeSubscriptionId } });
    return sub ? SubscriptionMapper.toDomain(sub) : null;
  }

  async save(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);
    await this.prisma.subscription.upsert({
      where: { organizationId: subscription.organizationId },
      update: data,
      create: data,
    });
  }
}
