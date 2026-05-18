import { Plan } from '../entities/plan.entity';

export const PLAN_REPOSITORY = Symbol('PLAN_REPOSITORY');

export interface PlanRepository {
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  findBySlug(slug: string): Promise<Plan | null>;
  findByStripePriceId(priceId: string): Promise<Plan | null>;
}
