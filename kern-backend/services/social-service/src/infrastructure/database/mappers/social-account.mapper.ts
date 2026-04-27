import { SocialAccount as MongoAccount } from '../schemas/social-account.schema';
import { SocialAccount } from '../../../domain/entities/social-account.entity';
import { SocialPlatform } from '../../../domain/value-objects/social-platform.vo';

export class SocialAccountMapper {
  static toDomain(mongoAccount: MongoAccount): SocialAccount {
    return new SocialAccount(
      mongoAccount._id.toString(),
      mongoAccount.organizationId,
      mongoAccount.platform as SocialPlatform,
      mongoAccount.platformUserId,
      mongoAccount.accessToken,
      mongoAccount.refreshToken || null,
      mongoAccount.expiresAt || null,
      mongoAccount.profileData || {},
      (mongoAccount as any).createdAt,
      (mongoAccount as any).updatedAt,
    );
  }

  static toPersistence(domainAccount: SocialAccount): Partial<MongoAccount> {
    return {
      organizationId: domainAccount.organizationId,
      platform: domainAccount.platform,
      platformUserId: domainAccount.platformUserId,
      accessToken: domainAccount.accessToken,
      refreshToken: domainAccount.refreshToken || undefined,
      expiresAt: domainAccount.expiresAt || undefined,
      profileData: domainAccount.profileData,
    };
  }
}
