import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectDto } from '../../application/dtos/create-project.dto';
import { UpdateProjectDto } from '../../application/dtos/update-project.dto';
import { CreateProjectCommand } from '../../application/commands/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/update-project.command';
import { ArchiveProjectCommand } from '../../application/commands/archive-project.command';
import { GetProjectQuery } from '../../application/queries/get-project.query';
import { ListProjectsQuery } from '../../application/queries/list-projects.query';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query('organizationId') organizationId: string, @Query('archived') archived?: boolean) {
    return this.queryBus.execute(new ListProjectsQuery(organizationId, archived));
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const id = await this.commandBus.execute(
      new CreateProjectCommand(dto.organizationId, dto.name, dto.description, dto.color),
    );
    return this.queryBus.execute(new GetProjectQuery(id));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.queryBus.execute(new GetProjectQuery(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    await this.commandBus.execute(
      new UpdateProjectCommand(id, dto.name, dto.description, dto.color),
    );
    return this.queryBus.execute(new GetProjectQuery(id));
  }

  @Delete(':id')
  async archive(@Param('id') id: string) {
    await this.commandBus.execute(new ArchiveProjectCommand(id));
  }
}
