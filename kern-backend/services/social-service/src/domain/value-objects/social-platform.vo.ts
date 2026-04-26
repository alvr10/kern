import { SocialPlatform as SharedSocialPlatform } from '@kern/shared';

export enum SocialPlatform {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
}

// Ensure compatibility with shared type
const _check: SharedSocialPlatform = SocialPlatform.TWITTER;
