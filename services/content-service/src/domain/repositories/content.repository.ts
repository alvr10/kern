import { ContentPiece } from '../entities/content-piece.entity';
import { Review } from '../entities/review.entity';

export const CONTENT_REPOSITORY = Symbol('CONTENT_REPOSITORY');

export interface ContentRepository {
  findById(id: string): Promise<ContentPiece | null>;
  save(contentPiece: ContentPiece): Promise<void>;
  update(contentPiece: ContentPiece): Promise<void>;
  addReview(review: Review): Promise<void>;
}
