import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPlansQuery } from './list-plans.query';
import { Inject } from '@nestjs/common';
import { PLAN_REPOSITORY, PlanRepository } from '../../domain/repositories/plan.repository';

@QueryHandler(ListPlansQuery)
export class ListPlansHandler implements IQueryHandler<ListPlansQuery> {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(_query: ListPlansQuery): Promise<any> {
    return this.planRepository.findAll();
  }
}
