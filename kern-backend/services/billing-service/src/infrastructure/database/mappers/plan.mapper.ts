import { Plan as PrismaPlan } from '@prisma/client';
import { Plan } from '../../../domain/entities/plan.entity';

export class PlanMapper {
  static toDomain(prisma: PrismaPlan): Plan {
    return new Plan(
      prisma.id,
      prisma.name,
      prisma.slug,
      prisma.monthlyTokenLimit,
      prisma.memberLimit,
      prisma.organizationLimit,
      Number(prisma.priceMonthlyUsd),
      prisma.features as string[],
      prisma.isActive,
      prisma.stripePriceIdMonthly,
    );
  }
}
