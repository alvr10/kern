import { apiClient } from "../client";
import type {
  AdaptContentDto,
  AIGenerationResponse,
  GenerateContentDto,
  ImproveContentDto,
  PaginatedGenerationsResponse,
  RewriteContentDto,
  TokenUsageResponse,
} from "./types";

/**
 * AI Service API Client
 */
export const aiClient = {
  /**
   * Generate a social media post with AI
   */
  generate: (data: GenerateContentDto): Promise<AIGenerationResponse> => {
    return apiClient.post<AIGenerationResponse>("/ai/generate", data);
  },

  /**
   * Rewrite an existing content piece
   */
  rewrite: (data: RewriteContentDto): Promise<AIGenerationResponse> => {
    return apiClient.post<AIGenerationResponse>("/ai/rewrite", data);
  },

  /**
   * Improve an existing draft
   */
  improve: (data: ImproveContentDto): Promise<AIGenerationResponse> => {
    return apiClient.post<AIGenerationResponse>("/ai/improve", data);
  },

  /**
   * Adapt content for a different social platform
   */
  adapt: (data: AdaptContentDto): Promise<AIGenerationResponse> => {
    return apiClient.post<AIGenerationResponse>("/ai/adapt", data);
  },

  /**
   * List past AI generations for an organization
   */
  listGenerations: (
    organizationId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedGenerationsResponse> => {
    return apiClient.get<PaginatedGenerationsResponse>("/ai/generations", {
      params: { ...params, organizationId },
    });
  },

  /**
   * Get token usage summary for an organization
   */
  getTokenUsage: (organizationId: string): Promise<TokenUsageResponse> => {
    return apiClient.get<TokenUsageResponse>(
      `/ai/token-usage/${organizationId}`,
    );
  },
};
