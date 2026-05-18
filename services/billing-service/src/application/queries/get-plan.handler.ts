import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlanQuery } from './get-plan.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { PLAN_REPOSITORY, PlanRepository } from '../../domain/repositories/plan.repository';

@QueryHandler(GetPlanQuery)
export class GetPlanHandler implements IQueryHandler<GetPlanQuery> {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(query: GetPlanQuery): Promise<any> {
    const plan = await this.planRepository.findById(query.id);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${query.id} not found`);
    }
    return plan;
  }
}
