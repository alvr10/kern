import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { ProjectRepository, PROJECT_REPOSITORY } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<string> {
    const id = uuidv4();
    const project = new Project(
      id,
      command.organizationId,
      command.name,
      command.description || null,
      command.color || null,
      false,
      new Date(),
      new Date(),
    );

    await this.projectRepository.save(project);
    return id;
  }
}
