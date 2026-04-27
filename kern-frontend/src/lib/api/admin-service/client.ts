import { apiClient } from "../client";
import type {
  AdminUserDetailResponse,
  AnalyticsOverviewResponse,
  OrgTokenUsageResponse,
  PaginatedOrgsResponse,
  PaginatedUsersResponse,
} from "./types";

/**
 * Admin Service API Client
 * Requires 'x-admin-secret' header for all requests
 */
export const adminClient = {
  /**
   * List all user profiles
   */
  listUsers: (
    adminSecret: string,
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<PaginatedUsersResponse> => {
    return apiClient.get<PaginatedUsersResponse>("/admin/users", {
      params,
      headers: { "x-admin-secret": adminSecret },
    });
  },

  /**
   * Get user profile with memberships
   */
  getUser: (adminSecret: string, id: string): Promise<AdminUserDetailResponse> => {
    return apiClient.get<AdminUserDetailResponse>(`/admin/users/${id}`, {
      headers: { "x-admin-secret": adminSecret },
    });
  },

  /**
   * Ban or unban a user
   */
  banUser: (
    adminSecret: string,
    id: string,
    banned: boolean
  ): Promise<void> => {
    return apiClient.patch<void>(
      `/admin/users/${id}/ban`,
      { banned },
      { headers: { "x-admin-secret": adminSecret } }
    );
  },

  /**
   * List all organizations with stats
   */
  listOrganizations: (
    adminSecret: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedOrgsResponse> => {
    return apiClient.get<PaginatedOrgsResponse>("/admin/organizations", {
      params,
      headers: { "x-admin-secret": adminSecret },
    });
  },

  /**
   * Hard-delete an organization
   */
  deleteOrganization: (adminSecret: string, id: string): Promise<void> => {
    return apiClient.delete<void>(`/admin/organizations/${id}`, {
      headers: { "x-admin-secret": adminSecret },
    });
  },

  /**
   * Platform-wide KPIs
   */
  getOverview: (adminSecret: string): Promise<AnalyticsOverviewResponse> => {
    return apiClient.get<AnalyticsOverviewResponse>("/admin/analytics/overview", {
      headers: { "x-admin-secret": adminSecret },
    });
  },

  /**
   * Token usage breakdown per organization
   */
  getTokenUsage: (
    adminSecret: string,
    params?: { page?: number; limit?: number }
  ): Promise<OrgTokenUsageResponse[]> => {
    return apiClient.get<OrgTokenUsageResponse[]>("/admin/analytics/tokens", {
      params,
      headers: { "x-admin-secret": adminSecret },
    });
  },
};
