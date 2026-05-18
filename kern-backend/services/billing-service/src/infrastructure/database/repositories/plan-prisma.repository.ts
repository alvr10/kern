import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlanRepository } from '../../../domain/repositories/plan.repository';
import { Plan } from '../../../domain/entities/plan.entity';
import { PlanMapper } from '../mappers/plan.mapper';

@Injectable()
export class PlanPrismaRepository implements PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
    });
    return plans.map(PlanMapper.toDomain);
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    return plan ? PlanMapper.toDomain(plan) : null;
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({ where: { slug } });
    return plan ? PlanMapper.toDomain(plan) : null;
  }

  async findByStripePriceId(priceId: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findFirst({
      where: {
        OR: [
          { stripePriceIdMonthly: priceId },
          { stripePriceIdYearly: priceId },
        ],
      },
    });
    return plan ? PlanMapper.toDomain(plan) : null;
  }
}
