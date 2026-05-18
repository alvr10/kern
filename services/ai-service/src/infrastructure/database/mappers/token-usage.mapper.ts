import { TokenUsage as MongoUsage } from '../schemas/token-usage.schema';
import { TokenUsage } from '../../../domain/entities/token-usage.entity';

export class TokenUsageMapper {
  static toDomain(mongo: MongoUsage): TokenUsage {
    return new TokenUsage(
      mongo.organizationId,
      mongo.tokensUsed,
      mongo.tokensLimit,
      mongo.resetAt || null,
      (mongo as any).updatedAt,
    );
  }

  static toPersistence(domain: TokenUsage): any {
    return {
      organizationId: domain.organizationId,
      tokensUsed: domain.tokensUsed,
      tokensLimit: domain.tokensLimit,
      resetAt: domain.resetAt,
    };
  }
}
