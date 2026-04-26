import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsObject()
  @IsOptional()
  brandVoice?: Record<string, any>;
}
