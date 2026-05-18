import { SocialPlatform } from '../types';

/**
 * Content status enum
 */
export enum ContentStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Data transfer object for creating content
 */
export interface CreateContentDto {
  organizationId: string;
  title: string;
  body: string;
  draftId?: string | null;
  platform: SocialPlatform;
  hashtags?: string[];
  mediaUrls?: string[];
  scheduledAt?: string | null;
}

/**
 * Data transfer object for updating content
 */
export interface UpdateContentDto {
  title?: string;
  body?: string;
  hashtags?: string[];
  mediaUrls?: string[];
  scheduledAt?: string | null;
  kanbanPosition?: number;
}

/**
 * Review response model
 */
export interface ReviewResponse {
  id: string;
  reviewerId: string;
  approved: boolean;
  comment: string | null;
  createdAt: string;
}

/**
 * Comment response model
 */
export interface CommentResponse {
  id: string;
  authorId: string;
  body: string;
  parentId: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/**
 * Content piece response model
 */
export interface ContentPieceResponse {
  id: string;
  _id?: string;
  organizationId: string;
  authorId: string;
  draftId: string | null;
  title: string;
  body: string;
  status: ContentStatus;
  platform: SocialPlatform;
  hashtags: string[];
  mediaUrls: string[];
  kanbanPosition: number;
  scheduledAt: string | null;
  publishedAt: string | null;
  reviews: ReviewResponse[];
  comments: CommentResponse[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated content response
 */
export interface PaginatedContentResponse {
  data: ContentPieceResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Kanban board response
 */
export interface KanbanResponse {
  DRAFT: ContentPieceResponse[];
  IN_REVIEW: ContentPieceResponse[];
  APPROVED: ContentPieceResponse[];
  PUBLISHED: ContentPieceResponse[];
  ARCHIVED: ContentPieceResponse[];
}

/**
 * Data transfer object for submitting a review
 */
export interface CreateReviewDto {
  approved: boolean;
  comment?: string | null;
}

/**
 * Data transfer object for adding a comment
 */
export interface CreateCommentDto {
  body: string;
  parentId?: string | null;
}
