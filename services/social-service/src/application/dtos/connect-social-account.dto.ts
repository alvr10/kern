import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class ConnectSocialAccountDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  platform: SocialPlatform;

  @IsString()
  @IsNotEmpty()
  platformUserId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsISO8601()
  @IsOptional()
  expiresAt?: string;
}
