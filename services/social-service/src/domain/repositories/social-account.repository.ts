import { SocialAccount } from '../entities/social-account.entity';
import { SocialPlatform } from '../value-objects/social-platform.vo';

export const SOCIAL_ACCOUNT_REPOSITORY = Symbol('SOCIAL_ACCOUNT_REPOSITORY');

export interface SocialAccountRepository {
  findById(id: string): Promise<SocialAccount | null>;
  findByOrganizationId(organizationId: string): Promise<SocialAccount[]>;
  findByPlatform(organizationId: string, platform: SocialPlatform): Promise<SocialAccount | null>;
  save(account: SocialAccount): Promise<void>;
  delete(id: string): Promise<void>;
}
