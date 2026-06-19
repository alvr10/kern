export class SocialAccountResponseDto {
  readonly id: string;
  readonly organizationId: string;
  readonly platform: string;
  readonly platformUserId: string;
  readonly profileData: Record<string, any>;
  readonly expiresAt: string | null;
  readonly createdAt: string;

  private constructor(props: {
    id: string;
    organizationId: string;
    platform: string;
    platformUserId: string;
    profileData: Record<string, any>;
    expiresAt: string | null;
    createdAt: string;
  }) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.platform = props.platform;
    this.platformUserId = props.platformUserId;
    this.profileData = props.profileData;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
  }

  public static fromPersistence(doc: any): SocialAccountResponseDto {
    return new SocialAccountResponseDto({
      id: doc.id || doc._id?.toString() || '',
      organizationId: doc.organizationId,
      platform: doc.platform,
      platformUserId: doc.platformUserId,
      profileData: doc.profileData || {},
      expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    });
  }

  public static fromFallback(accountId: string, command: any): SocialAccountResponseDto {
    return new SocialAccountResponseDto({
      id: accountId,
      organizationId: command.organizationId,
      platform: command.platform,
      platformUserId: command.platformUserId,
      profileData: {
        handle: `@kern_mock_${command.platform.toLowerCase()}`,
        name: `KERN Mock ${command.platform}`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${command.platform}`,
      },
      expiresAt: command.expiresAt ? new Date(command.expiresAt).toISOString() : null,
      createdAt: new Date().toISOString(),
    });
  }
}
