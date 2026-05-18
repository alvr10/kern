import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CONTENT_STATUS_VALUES, ContentStatus, SOCIAL_PLATFORM_VALUES, SocialPlatform } from '@kern/core-backend';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  authorId: string; // profiles.id (Supabase UUID)

  @Prop({ required: true })
  body: string;

  @Prop({ type: String })
  parentId?: string;

  @Prop()
  resolvedAt?: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ContentReview {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  reviewerId: string;

  @Prop({ required: true })
  approved: boolean;

  @Prop()
  comment?: string;
}
export const ContentReviewSchema = SchemaFactory.createForClass(ContentReview);

@Schema({ timestamps: true, collection: 'content_pieces' })
export class ContentPiece {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, index: true, unique: true, sparse: true })
  draftId?: string;

  @Prop({ required: true, index: true })
  organizationId: string;

  @Prop({ required: true, index: true })
  authorId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({
    type: String,
    enum: CONTENT_STATUS_VALUES,
    default: 'DRAFT',
    index: true,
  })
  status: ContentStatus;

  @Prop({
    type: String,
    enum: SOCIAL_PLATFORM_VALUES,
    required: true,
    index: true,
  })
  platform: SocialPlatform;

  @Prop({ type: [String], default: [] })
  hashtags: string[];

  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  @Prop({ type: Number, default: 0 })
  kanbanPosition: number;

  @Prop({ index: true })
  scheduledAt?: Date;

  @Prop()
  publishedAt?: Date;

  @Prop({ index: true })
  deletedAt?: Date;

  @Prop({ type: [ContentReviewSchema], default: [] })
  reviews: ContentReview[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export type ContentPieceDocument = ContentPiece & Document;
export const ContentPieceSchema = SchemaFactory.createForClass(ContentPiece);

ContentPieceSchema.index({ organizationId: 1, status: 1 });
ContentPieceSchema.index({ organizationId: 1, scheduledAt: 1 });
ContentPieceSchema.index({ organizationId: 1, kanbanPosition: 1 });
