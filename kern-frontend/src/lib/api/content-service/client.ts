import { apiClient } from "../client";
import { SocialPlatform } from "../types";
import type {
  CommentResponse,
  ContentPieceResponse,
  ContentStatus,
  CreateCommentDto,
  CreateContentDto,
  CreateReviewDto,
  KanbanResponse,
  PaginatedContentResponse,
  UpdateContentDto,
} from "./types";

/**
 * Content Service API Client
 */
export const contentClient = {
  /**
   * List content pieces
   */
  listContent: (params: {
    projectId: string;
    status?: ContentStatus;
    platform?: SocialPlatform;
    page?: number;
    limit?: number;
  }): Promise<PaginatedContentResponse> => {
    return apiClient.get<PaginatedContentResponse>("/content", { params });
  },

  /**
   * Create a new content piece
   */
  createContent: (data: CreateContentDto): Promise<ContentPieceResponse> => {
    return apiClient.post<ContentPieceResponse>("/content", data);
  },

  /**
   * Get content pieces grouped by status for Kanban view
   */
  getKanban: (projectId: string): Promise<KanbanResponse> => {
    return apiClient.get<KanbanResponse>("/content/kanban", {
      params: { projectId },
    });
  },

  /**
   * Get scheduled content pieces for a date range
   */
  getCalendar: (
    projectId: string,
    from: string,
    to: string
  ): Promise<ContentPieceResponse[]> => {
    return apiClient.get<ContentPieceResponse[]>("/content/calendar", {
      params: { projectId, from, to },
    });
  },

  /**
   * Get a content piece by ID
   */
  getContent: (id: string): Promise<ContentPieceResponse> => {
    return apiClient.get<ContentPieceResponse>(`/content/${id}`);
  },

  /**
   * Update a content piece
   */
  updateContent: (
    id: string,
    data: UpdateContentDto
  ): Promise<ContentPieceResponse> => {
    return apiClient.patch<ContentPieceResponse>(`/content/${id}`, data);
  },

  /**
   * Soft-delete a content piece
   */
  deleteContent: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/content/${id}`);
  },

  /**
   * Transition content piece status
   */
  updateStatus: (
    id: string,
    status: ContentStatus
  ): Promise<ContentPieceResponse> => {
    return apiClient.patch<ContentPieceResponse>(`/content/${id}/status`, {
      status,
    });
  },

  /**
   * Submit a review for a content piece
   */
  submitReview: (
    id: string,
    data: CreateReviewDto
  ): Promise<ContentPieceResponse> => {
    return apiClient.post<ContentPieceResponse>(`/content/${id}/reviews`, data);
  },

  /**
   * List comments on a content piece
   */
  listComments: (id: string): Promise<CommentResponse[]> => {
    return apiClient.get<CommentResponse[]>(`/content/${id}/comments`);
  },

  /**
   * Add a comment to a content piece
   */
  addComment: (
    id: string,
    data: CreateCommentDto
  ): Promise<CommentResponse> => {
    return apiClient.post<CommentResponse>(`/content/${id}/comments`, data);
  },
};
