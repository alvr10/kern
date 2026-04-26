import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  slug: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
