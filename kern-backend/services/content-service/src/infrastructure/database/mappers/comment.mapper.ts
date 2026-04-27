import { Comment as MongoComment } from '../schemas/content-piece.schema';
import { Comment } from '../../../domain/entities/comment.entity';
import { Types } from 'mongoose';

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
      _id: new Types.ObjectId(domainComment.id),
      authorId: domainComment.authorId,
      body: domainComment.body,
      parentId: domainComment.parentId ? new Types.ObjectId(domainComment.parentId) : undefined,
      resolvedAt: domainComment.resolvedAt || undefined,
    } as MongoComment;
  }
}
