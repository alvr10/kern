import { SocialPlatform } from '../value-objects/social-platform.vo';

export class SocialAccount {
  constructor(
    public id: string,
    public readonly organizationId: string,
    public readonly platform: SocialPlatform,
    public readonly platformUserId: string,
    public accessToken: string,
    public refreshToken: string | null,
    public expiresAt: Date | null,
    public profileData: Record<string, any>,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public updateTokens(accessToken: string, refreshToken?: string | null, expiresAt?: Date | null): void {
    this.accessToken = accessToken;
    if (refreshToken !== undefined) this.refreshToken = refreshToken;
    if (expiresAt !== undefined) this.expiresAt = expiresAt;
    this.updatedAt = new Date();
  }

  public updateProfile(profileData: Record<string, any>): void {
    this.profileData = profileData;
    this.updatedAt = new Date();
  }
}
