import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ListPlansQuery } from '../../application/queries/list-plans.query';
import { GetPlanQuery } from '../../application/queries/get-plan.query';

@Controller('billing/plans')
export class PlansController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async list() {
    return this.queryBus.execute(new ListPlansQuery());
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.queryBus.execute(new GetPlanQuery(id));
  }
}
