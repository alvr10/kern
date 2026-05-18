import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubmitReviewCommand } from './submit-review.command';
import { ContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository';
import { Review } from '../../domain/entities/review.entity';
import { ContentStatus } from '../../domain/value-objects/content-status.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(SubmitReviewCommand)
export class SubmitReviewHandler implements ICommandHandler<SubmitReviewCommand> {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute(command: SubmitReviewCommand): Promise<void> {
    const contentPiece = await this.contentRepository.findById(command.contentPieceId);
    if (!contentPiece) throw new Error('Content piece not found');

    const review = new Review(
      uuidv4(),
      command.contentPieceId,
      command.reviewerId,
      command.approved,
      command.comment || null,
      new Date(),
    );

    await this.contentRepository.addReview(review);

    // Business Logic: If approved, we might transition status or wait for more reviews.
    // For now, let's keep it simple.
    if (command.approved) {
      contentPiece.transitionTo(ContentStatus.APPROVED);
      await this.contentRepository.update(contentPiece);
    }
  }
}
