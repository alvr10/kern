import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddCommentCommand } from '../../application/commands/add-comment.command';
import { ListCommentsQuery } from '../../application/queries/list-comments.query';

@Controller('content/:id/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Param('id') contentPieceId: string) {
    return this.queryBus.execute(new ListCommentsQuery(contentPieceId));
  }

  @Post()
  async addComment(
    @Param('id') contentPieceId: string,
    @Body() dto: { body: string; parentId?: string },
  ) {
    const authorId = 'dummy-author-id';
    const commentId = await this.commandBus.execute(
      new AddCommentCommand(contentPieceId, authorId, dto.body, dto.parentId),
    );
    return { id: commentId };
  }
}
