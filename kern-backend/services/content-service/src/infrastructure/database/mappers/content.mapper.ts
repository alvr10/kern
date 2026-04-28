import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../schemas/content-piece.schema';
import { ContentPiece } from '../../../domain/entities/content-piece.entity';
import { ReviewMapper } from './review.mapper';
import { ContentStatus } from '../../../domain/value-objects/content-status.vo';
import { SocialPlatform } from '../../../domain/value-objects/social-platform.vo';

export class ContentMapper {
  static toDomain(mongoPiece: ContentPieceDocument): ContentPiece {
    return new ContentPiece(
      mongoPiece._id.toString(),
      mongoPiece.organizationId,
      mongoPiece.authorId,
      mongoPiece.title,
      mongoPiece.body,
      mongoPiece.status as ContentStatus,
      mongoPiece.platform as SocialPlatform,
      mongoPiece.hashtags,
      mongoPiece.mediaUrls,
      mongoPiece.kanbanPosition,
      mongoPiece.scheduledAt || null,
      mongoPiece.publishedAt || null,
      (mongoPiece.reviews || []).map(ReviewMapper.toDomain),
      (mongoPiece as any).createdAt,
      (mongoPiece as any).updatedAt,
      mongoPiece.deletedAt || null,
    );
  }

  static toPersistence(domainPiece: ContentPiece): Partial<MongoContentPiece> {
    return {
      _id: domainPiece.id,
      organizationId: domainPiece.organizationId,
      authorId: domainPiece.authorId,
      title: domainPiece.title,
      body: domainPiece.body,
      status: domainPiece.status as any,
      platform: domainPiece.platform as any,
      hashtags: domainPiece.hashtags,
      mediaUrls: domainPiece.mediaUrls,
      kanbanPosition: domainPiece.kanbanPosition,
      scheduledAt: domainPiece.scheduledAt || undefined,
      publishedAt: domainPiece.publishedAt || undefined,
      deletedAt: domainPiece.deletedAt || undefined,
    };
  }
}
