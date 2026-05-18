/**
 * Admin Service Types
 * TypeScript types for platform management, user/org analytics, and system oversight
 */

/**
 * User detail for admin overview
 */
export interface AdminUserDetailResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  memberships: {
    organizationId: string;
    organizationName: string;
    role: string;
  }[];
  createdAt: string;
}

/**
 * Paginated response for users
 */
export interface PaginatedUsersResponse {
  data: AdminUserDetailResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Organization item for admin list
 */
export interface AdminOrgListItem {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
  projectCount: number;
  subscriptionStatus: string;
  createdAt: string;
}

/**
 * Paginated response for organizations
 */
export interface PaginatedOrgsResponse {
  data: AdminOrgListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Platform-wide analytics overview
 */
export interface AnalyticsOverviewResponse {
  totalUsers: number;
  totalOrganizations: number;
  totalContentPieces: number;
  totalAIGenerations: number;
  totalTokensConsumed: number;
  activeSubscriptions: number;
}

/**
 * Token usage breakdown per organization
 */
export interface OrgTokenUsageResponse {
  organizationId: string;
  organizationName: string;
  tokensUsed: number;
  tokensLimit: number;
  percentUsed: number;
}
