import { ContentReview as MongoReview } from '../schemas/content-piece.schema';
import { Review } from '../../../domain/entities/review.entity';

export class ReviewMapper {
  static toDomain(mongoReview: MongoReview): Review {
    return new Review(
      mongoReview._id.toString(),
      '', // contentPieceId is implied in Mongo embed
      mongoReview.reviewerId,
      mongoReview.approved,
      mongoReview.comment || null,
      (mongoReview as any).createdAt || new Date(),
    );
  }

  static toPersistence(domainReview: Review): MongoReview {
    return {
      _id: domainReview.id,
      reviewerId: domainReview.reviewerId,
      approved: domainReview.approved,
      comment: domainReview.comment || undefined,
    } as MongoReview;
  }
}
