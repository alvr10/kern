import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateContentDto } from '../../application/dtos/create-content.dto';
import { CreateContentCommand } from '../../application/commands/create-content.command';
import { UpdateContentCommand } from '../../application/commands/update-content.command';
import { UpdateContentStatusCommand } from '../../application/commands/update-content-status.command';
import { GetKanbanQuery } from '../../application/queries/get-kanban.query';
import { GetCalendarQuery } from '../../application/queries/get-calendar.query';
import { ListContentQuery } from '../../application/queries/list-content.query';
import { GetContentQuery } from '../../application/queries/get-content.query';
import { ContentStatus } from '../../domain/value-objects/content-status.vo';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

@Controller('content')
export class ContentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateContentDto) {
    const authorId = 'dummy-author-id';
    const id = await this.commandBus.execute(
      new CreateContentCommand(
        dto.organizationId,
        authorId,
        dto.draftId || null,
        dto.title,
        dto.body,
        dto.platform,
        dto.hashtags,
        dto.mediaUrls,
        dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      ),
    );
    return this.queryBus.execute(new GetContentQuery(id));
  }

  @Get()
  async list(
    @Query('organizationId') organizationId: string,
    @Query('status') status?: ContentStatus,
    @Query('platform') platform?: SocialPlatform,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(new ListContentQuery(organizationId, status, platform, page, limit));
  }

  @Get('kanban')
  async getKanban(@Query('organizationId') organizationId: string) {
    return this.queryBus.execute(new GetKanbanQuery(organizationId));
  }

  @Get('calendar')
  async getCalendar(
    @Query('organizationId') organizationId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.queryBus.execute(new GetCalendarQuery(organizationId, new Date(from), new Date(to)));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.queryBus.execute(new GetContentQuery(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    await this.commandBus.execute(new UpdateContentCommand(id, dto));
    return this.queryBus.execute(new GetContentQuery(id));
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: ContentStatus) {
    await this.commandBus.execute(new UpdateContentStatusCommand(id, status));
    return this.queryBus.execute(new GetContentQuery(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Soft delete logic can be added to a command
    await this.commandBus.execute(new UpdateContentStatusCommand(id, ContentStatus.ARCHIVED));
  }
}
