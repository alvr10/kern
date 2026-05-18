import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class GenerateContentDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsOptional()
  contentPieceId?: string;

  @IsString()
  @IsOptional()
  draftId?: string;

  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsInt()
  @IsOptional()
  maxLength?: number;
}
