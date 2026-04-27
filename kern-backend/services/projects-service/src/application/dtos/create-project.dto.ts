import { IsNotEmpty, IsOptional, IsString, IsHexColor } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}
