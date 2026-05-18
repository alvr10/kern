import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubmitReviewCommand } from '../../application/commands/submit-review.command';
import { GetContentQuery } from '../../application/queries/get-content.query';

@Controller('content/:id/reviews')
export class ReviewsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async submitReview(@Param('id') contentPieceId: string, @Body() dto: { approved: boolean; comment?: string }) {
    const reviewerId = 'dummy-reviewer-id';
    await this.commandBus.execute(new SubmitReviewCommand(contentPieceId, reviewerId, dto.approved, dto.comment));
    return this.queryBus.execute(new GetContentQuery(contentPieceId));
  }
}
