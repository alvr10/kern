import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTokenUsageQuery } from './get-token-usage.query';
import { TokenUsageRepository, TOKEN_USAGE_REPOSITORY } from '../../domain/repositories/token-usage.repository';
import { Inject } from '@nestjs/common';
import { TokenUsage } from '../../domain/entities/token-usage.entity';

@QueryHandler(GetTokenUsageQuery)
export class GetTokenUsageHandler implements IQueryHandler<GetTokenUsageQuery> {
  constructor(
    @Inject(TOKEN_USAGE_REPOSITORY)
    private readonly usageRepository: TokenUsageRepository,
  ) {}

  async execute(query: GetTokenUsageQuery): Promise<any> {
    let usage = await this.usageRepository.findByOrganizationId(query.organizationId);
    if (!usage) {
      usage = new TokenUsage(query.organizationId, 0, 50000, null, new Date());
    }

    return {
      organizationId: usage.organizationId,
      tokensUsed: usage.tokensUsed,
      tokensLimit: usage.tokensLimit,
      percentUsed: usage.getPercentUsed(),
      resetAt: usage.resetAt,
    };
  }
}
