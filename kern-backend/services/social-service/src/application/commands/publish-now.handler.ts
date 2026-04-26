import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishNowCommand } from './publish-now.command';
import { SocialPublisherMock } from '../../infrastructure/external-api/social-publisher.mock';
import { ContentServiceClient } from '../../infrastructure/external-api/content-service.client';
import { SocialAccountRepository, SOCIAL_ACCOUNT_REPOSITORY } from '../../domain/repositories/social-account.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(PublishNowCommand)
export class PublishNowHandler implements ICommandHandler<PublishNowCommand> {
  constructor(
    private readonly publisherMock: SocialPublisherMock,
    private readonly contentClient: ContentServiceClient,
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly accountRepository: SocialAccountRepository,
  ) {}

  async execute(command: PublishNowCommand): Promise<any> {
    // 1. Fetch REAL content data from content-service
    const contentPiece = await this.contentClient.getContentPiece(command.contentPieceId);
    
    // 2. Fetch the connected social account for this organization and platform
    const account = await this.accountRepository.findByPlatform(
      contentPiece.organizationId, 
      contentPiece.platform
    );

    if (!account) {
      throw new Error(`No social account connected for platform ${contentPiece.platform}`);
    }

    // 3. Perform MOCK publishing
    const result = await this.publisherMock.publish(
      contentPiece.platform,
      {
        title: contentPiece.title,
        body: contentPiece.body,
        mediaUrls: contentPiece.mediaUrls,
      },
      account.accessToken
    );

    return {
      contentPieceId: contentPiece.id,
      platform: contentPiece.platform,
      platformPostId: result.platformPostId,
      publishedAt: result.publishedAt,
      url: result.url,
    };
  }
}
