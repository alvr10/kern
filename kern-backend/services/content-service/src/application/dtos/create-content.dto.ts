import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];

  @IsISO8601()
  @IsOptional()
  scheduledAt?: string;
}
