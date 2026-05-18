import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateContentStatusCommand } from './update-content-status.command';
import { ContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateContentStatusCommand)
export class UpdateContentStatusHandler implements ICommandHandler<UpdateContentStatusCommand> {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute(command: UpdateContentStatusCommand): Promise<void> {
    const contentPiece = await this.contentRepository.findById(command.id);
    if (!contentPiece) throw new Error('Content piece not found');

    contentPiece.transitionTo(command.status);
    await this.contentRepository.update(contentPiece);
  }
}
