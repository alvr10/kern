import { SocialPlatform } from '../types';

/**
 * Data transfer object for connecting a social account
 */
export interface ConnectSocialAccountDto {
  organizationId: string;
  platform: SocialPlatform;
  platformUserId: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: string | null;
}

/**
 * Social account response model
 */
export interface SocialAccountResponse {
  id: string;
  organizationId: string;
  platform: SocialPlatform;
  platformUserId: string;
  profileData: Record<string, unknown>;
  expiresAt: string | null;
  createdAt: string;
}
