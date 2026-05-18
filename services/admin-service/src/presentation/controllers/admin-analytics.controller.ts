import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetPlatformOverviewQuery } from '../../application/queries/get-platform-overview.query';
import { AdminSecretGuard } from '../../infrastructure/guards/admin-secret.guard';

@Controller('admin/analytics')
@UseGuards(AdminSecretGuard)
export class AdminAnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('overview')
  async getOverview() {
    return this.queryBus.execute(new GetPlatformOverviewQuery());
  }
}
