import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { SocialAccountsController } from './presentation/controllers/social-accounts.controller';
import { PublishingController } from './presentation/controllers/publishing.controller';
import { ConnectSocialAccountHandler } from './application/commands/connect-social-account.handler';
import { PublishNowHandler } from './application/commands/publish-now.handler';
import { ListSocialAccountsHandler } from './application/queries/list-social-accounts.handler';
import { SOCIAL_ACCOUNT_REPOSITORY } from './domain/repositories/social-account.repository';
import { SocialAccountMongoRepository } from './infrastructure/database/repositories/social-account-mongo.repository';
import { SocialPublisherMock } from './infrastructure/external-api/social-publisher.mock';
import { ContentServiceClient } from './infrastructure/external-api/content-service.client';

const Handlers = [ConnectSocialAccountHandler, PublishNowHandler, ListSocialAccountsHandler];

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [SocialAccountsController, PublishingController],
  providers: [
    ...Handlers,
    SocialPublisherMock,
    ContentServiceClient,
    {
      provide: SOCIAL_ACCOUNT_REPOSITORY,
      useClass: SocialAccountMongoRepository,
    },
  ],
})
export class SocialModule {}
