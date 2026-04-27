import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { AdminAnalyticsController } from './presentation/controllers/admin-analytics.controller';
import { AdminUsersController } from './presentation/controllers/admin-users.controller';
import { AdminOrgsController } from './presentation/controllers/admin-orgs.controller';
import { HealthController } from './presentation/controllers/health.controller';

import { GetPlatformOverviewHandler } from './application/queries/get-platform-overview.handler';

import { OrganizationsClient } from './infrastructure/external-api/organizations.client';
import { ContentClient } from './infrastructure/external-api/content.client';
import { AIClient } from './infrastructure/external-api/ai.client';
import { AdminSecretGuard } from './infrastructure/guards/admin-secret.guard';

const Handlers = [GetPlatformOverviewHandler];

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [AdminAnalyticsController, AdminUsersController, AdminOrgsController, HealthController],
  providers: [...Handlers, OrganizationsClient, ContentClient, AIClient, AdminSecretGuard],
})
export class AdminModule {}
