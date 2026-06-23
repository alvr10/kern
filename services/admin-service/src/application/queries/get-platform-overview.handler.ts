import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlatformOverviewQuery } from './get-platform-overview.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ContentClient } from '../../infrastructure/external-api/content.client';
import { AIClient } from '../../infrastructure/external-api/ai.client';

@QueryHandler(GetPlatformOverviewQuery)
export class GetPlatformOverviewHandler implements IQueryHandler<GetPlatformOverviewQuery> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentClient: ContentClient,
    private readonly aiClient: AIClient,
  ) {}

  async execute(): Promise<unknown> {
    const [totalUsers, totalOrganizations, totalContent, aiStats] = await Promise.all([
      this.prisma.profile.count().catch(() => 0),
      this.prisma.organization.count({ where: { deletedAt: null } }).catch(() => 0),
      this.contentClient.countAll().catch(() => 0),
      this.aiClient.getTokenUsageStats().catch(() => ({ totalTokens: 0 })),
    ]);

    const totalTokensUsed = (aiStats as { totalTokens?: number }).totalTokens ?? 0;

    return {
      totalUsers,
      totalOrganizations,
      totalContentPieces: typeof totalContent === 'number' ? totalContent : 0,
      totalTokensUsed,
    };
  }
}
