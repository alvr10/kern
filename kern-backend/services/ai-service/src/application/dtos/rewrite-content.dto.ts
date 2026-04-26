import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RewriteContentDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  contentPieceId: string;

  @IsString()
  @IsNotEmpty()
  originalText: string;

  @IsString()
  @IsOptional()
  instructions?: string;
}
