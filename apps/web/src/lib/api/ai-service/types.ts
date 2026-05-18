import { SocialPlatform } from '../types';

/**
 * Health check response
 */
export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

/**
 * AI action types
 */
export enum AIActionType {
  GENERATE = 'GENERATE',
  REWRITE = 'REWRITE',
  ADAPT = 'ADAPT',
  IMPROVE = 'IMPROVE',
}

/**
 * Data transfer object for content generation
 */
export interface GenerateContentDto {
  organizationId: string;
  contentPieceId?: string | null;
  draftId?: string | null;
  platform: SocialPlatform;
  topic: string;
  tone?: string | null;
  maxLength?: number | null;
}

/**
 * Data transfer object for content rewriting
 */
export interface RewriteContentDto {
  organizationId: string;
  contentPieceId: string;
  draftId?: string | null;
  originalText: string;
  instructions?: string | null;
}

/**
 * Data transfer object for content improvement
 */
export interface ImproveContentDto {
  organizationId: string;
  contentPieceId: string;
  draftId?: string | null;
  originalText: string;
}

/**
 * Data transfer object for content adaptation
 */
export interface AdaptContentDto {
  organizationId: string;
  contentPieceId: string;
  draftId?: string | null;
  originalText: string;
  targetPlatform: SocialPlatform;
}

/**
 * AI generation response
 */
export interface AIGenerationResponse {
  id: string;
  organizationId: string;
  contentPieceId: string | null;
  draftId: string | null;
  actionType: AIActionType;
  platform: SocialPlatform;
  prompt: string;
  generatedText: string;
  tokensUsed: number;
  estimatedCostUsd: number;
  createdAt: string;
}

/**
 * Paginated AI generations response
 */
export interface PaginatedGenerationsResponse {
  data: AIGenerationResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Token usage summary for an organization
 */
export interface TokenUsageResponse {
  organizationId: string;
  tokensUsed: number;
  tokensLimit: number;
  percentUsed: number;
  resetAt: string | null;
}
