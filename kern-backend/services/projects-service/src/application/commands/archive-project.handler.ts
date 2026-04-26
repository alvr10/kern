import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveProjectCommand } from './archive-project.command';
import { ProjectRepository, PROJECT_REPOSITORY } from '../../domain/repositories/project.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(ArchiveProjectCommand)
export class ArchiveProjectHandler implements ICommandHandler<ArchiveProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: ArchiveProjectCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.id);
    if (!project) throw new Error('Project not found');

    project.archive();
    await this.projectRepository.update(project);
  }
}
