import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContentController } from './presentation/controllers/content.controller';
import { ReviewsController } from './presentation/controllers/reviews.controller';
import { CommentsController } from './presentation/controllers/comments.controller';

import { CreateContentHandler } from './application/commands/create-content.handler';
import { UpdateContentHandler } from './application/commands/update-content.handler';
import { SubmitReviewHandler } from './application/commands/submit-review.handler';
import { AddCommentHandler } from './application/commands/add-comment.handler';
import { UpdateContentStatusHandler } from './application/commands/update-content-status.handler';

import { GetKanbanHandler } from './application/queries/get-kanban.handler';
import { GetCalendarHandler } from './application/queries/get-calendar.handler';
import { ListContentHandler } from './application/queries/list-content.handler';
import { GetContentHandler } from './application/queries/get-content.handler';
import { ListCommentsHandler } from './application/queries/list-comments.handler';

import { CONTENT_REPOSITORY } from './domain/repositories/content.repository';
import { ContentMongoRepository } from './infrastructure/database/repositories/content-mongo.repository';
import { COMMENT_REPOSITORY } from './domain/repositories/comment.repository';
import { CommentMongoRepository } from './infrastructure/database/repositories/comment-mongo.repository';

const Handlers = [
  CreateContentHandler,
  UpdateContentHandler,
  SubmitReviewHandler,
  AddCommentHandler,
  UpdateContentStatusHandler,
  GetKanbanHandler,
  GetCalendarHandler,
  ListContentHandler,
  GetContentHandler,
  ListCommentsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ContentController, ReviewsController, CommentsController],
  providers: [
    ...Handlers,
    {
      provide: CONTENT_REPOSITORY,
      useClass: ContentMongoRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentMongoRepository,
    },
  ],
})
export class ContentModule {}
