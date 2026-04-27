import { Comment } from '../entities/comment.entity';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByContentPieceId(contentPieceId: string): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
  update(comment: Comment): Promise<void>;
}
