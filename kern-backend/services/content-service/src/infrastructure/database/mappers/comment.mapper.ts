import { Comment as MongoComment } from '../schemas/content-piece.schema';
import { Comment } from '../../../domain/entities/comment.entity';

export class CommentMapper {
  static toDomain(mongoComment: MongoComment, contentPieceId: string): Comment {
    return new Comment(
      mongoComment._id.toString(),
      contentPieceId,
      mongoComment.authorId,
      mongoComment.body,
      mongoComment.parentId ? mongoComment.parentId.toString() : null,
      mongoComment.resolvedAt || null,
      (mongoComment as any).createdAt || new Date(),
    );
  }

  static toPersistence(domainComment: Comment): MongoComment {
    return {
      _id: domainComment.id,
      authorId: domainComment.authorId,
      body: domainComment.body,
      parentId: domainComment.parentId || undefined,
      resolvedAt: domainComment.resolvedAt || undefined,
    } as MongoComment;
  }
}
