import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateContentCommand } from './update-content.command';
import { ContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateContentCommand)
export class UpdateContentHandler implements ICommandHandler<UpdateContentCommand> {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute(command: UpdateContentCommand): Promise<void> {
    const contentPiece = await this.contentRepository.findById(command.id);
    if (!contentPiece) throw new Error('Content piece not found');

    contentPiece.update(command.data);
    await this.contentRepository.update(contentPiece);
  }
}
