import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCommentCommand } from './add-comment.command';
import { CommentRepository, COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import { Comment } from '../../domain/entities/comment.entity';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(command: AddCommentCommand): Promise<string> {
    const id = uuidv4();
    const comment = new Comment(
      id,
      command.contentPieceId,
      command.authorId,
      command.body,
      command.parentId || null,
      null,
      new Date(),
    );

    await this.commentRepository.save(comment);
    return id;
  }
}
