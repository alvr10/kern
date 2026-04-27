import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectsController } from './presentation/controllers/projects.controller';
import { CreateProjectHandler } from './application/commands/create-project.handler';
import { UpdateProjectHandler } from './application/commands/update-project.handler';
import { ArchiveProjectHandler } from './application/commands/archive-project.handler';
import { ListProjectsHandler } from './application/queries/list-projects.handler';
import { GetProjectHandler } from './application/queries/get-project.handler';
import { PROJECT_REPOSITORY } from './domain/repositories/project.repository';
import { ProjectPrismaRepository } from './infrastructure/database/repositories/project-prisma.repository';

const Handlers = [
  CreateProjectHandler,
  UpdateProjectHandler,
  ArchiveProjectHandler,
  ListProjectsHandler,
  GetProjectHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProjectsController],
  providers: [
    ...Handlers,
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectPrismaRepository,
    },
  ],
})
export class ProjectsModule {}
