import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateContentCommand } from './create-content.command';
import { ContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository';
import { ContentPiece } from '../../domain/entities/content-piece.entity';
import { ContentStatus } from '../../domain/value-objects/content-status.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateContentCommand)
export class CreateContentHandler implements ICommandHandler<CreateContentCommand> {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute(command: CreateContentCommand): Promise<string> {
    const id = uuidv4();
    
    const contentPiece = new ContentPiece(
      id,
      command.projectId,
      command.organizationId,
      command.authorId,
      command.title,
      command.body,
      ContentStatus.DRAFT,
      command.platform,
      command.hashtags || [],
      command.mediaUrls || [],
      0, // initial position
      command.scheduledAt || null,
      null,
      [],
      new Date(),
      new Date(),
    );

    await this.contentRepository.save(contentPiece);
    return id;
  }
}
