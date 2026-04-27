import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateContentDto } from '../../application/dtos/generate-content.dto';
import { RewriteContentDto } from '../../application/dtos/rewrite-content.dto';
import { GenerateContentCommand } from '../../application/commands/generate-content.command';
import { RewriteContentCommand } from '../../application/commands/rewrite-content.command';
import { GetTokenUsageQuery } from '../../application/queries/get-token-usage.query';

@Controller('ai')
export class GenerationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('generate')
  async generate(@Body() dto: GenerateContentDto) {
    return this.commandBus.execute(
      new GenerateContentCommand(
        dto.organizationId,
        dto.platform,
        dto.topic,
        dto.contentPieceId,
        dto.tone,
        dto.maxLength,
      ),
    );
  }

  @Post('rewrite')
  async rewrite(@Body() dto: RewriteContentDto) {
    return this.commandBus.execute(
      new RewriteContentCommand(dto.organizationId, dto.contentPieceId, dto.originalText, dto.instructions),
    );
  }

  @Get('token-usage/:organizationId')
  async getUsage(@Query('organizationId') organizationId: string) {
    return this.queryBus.execute(new GetTokenUsageQuery(organizationId));
  }
}
