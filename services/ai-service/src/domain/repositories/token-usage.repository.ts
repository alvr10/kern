import { TokenUsage } from '../entities/token-usage.entity';

export const TOKEN_USAGE_REPOSITORY = Symbol('TOKEN_USAGE_REPOSITORY');

export interface TokenUsageRepository {
  findByOrganizationId(organizationId: string): Promise<TokenUsage | null>;
  save(usage: TokenUsage): Promise<void>;
}
