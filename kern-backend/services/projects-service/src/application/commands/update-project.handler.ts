import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProjectCommand } from './update-project.command';
import { ProjectRepository, PROJECT_REPOSITORY } from '../../domain/repositories/project.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.id);
    if (!project) throw new Error('Project not found');

    project.update(command.name, command.description, command.color);
    await this.projectRepository.update(project);
  }
}
