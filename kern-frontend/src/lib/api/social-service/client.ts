import { apiClient } from "../client";
import type {
  ConnectSocialAccountDto,
  PublishResultResponse,
  SocialAccountResponse,
} from "./types";

/**
 * Social Service API Client
 */
export const socialClient = {
  /**
   * List connected social accounts for an organization
   */
  listAccounts: (organizationId: string): Promise<SocialAccountResponse[]> => {
    return apiClient.get<SocialAccountResponse[]>("/social/accounts", {
      params: { organizationId },
    });
  },

  /**
   * Connect a new social media account
   */
  connectAccount: (
    data: ConnectSocialAccountDto
  ): Promise<SocialAccountResponse> => {
    return apiClient.post<SocialAccountResponse>("/social/accounts", data);
  },

  /**
   * Disconnect a social media account
   */
  disconnectAccount: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/social/accounts/${id}`);
  },

  /**
   * Publish a content piece immediately to its platform
   */
  publishNow: (contentPieceId: string): Promise<PublishResultResponse> => {
    return apiClient.post<PublishResultResponse>(
      `/social/publish/${contentPieceId}`
    );
  },
};
