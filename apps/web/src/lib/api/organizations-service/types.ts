/**
 * Organizations Service Types
 * TypeScript types for organization management, memberships, and invitations
 */

/**
 * Member roles within an organization
 */
export enum MemberRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

/**
 * Organization types
 */
export enum OrganizationType {
  PERSONAL = "PERSONAL",
  TEAM = "TEAM",
}

/**
 * Data transfer object for creating an organization
 */
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  logoUrl?: string | null;
}

/**
 * Data transfer object for updating an organization
 */
export interface UpdateOrganizationDto {
  name?: string;
  logoUrl?: string | null;
  brandVoice?: Record<string, unknown>;
}

/**
 * Data transfer object for transferring ownership
 */
export interface TransferOwnershipDto {
  newOwnerId: string;
}

/**
 * Organization details response
 */
export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  ownerId: string;
  logoUrl: string | null;
  brandVoice: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Membership details response
 */
export interface MembershipResponse {
  id: string;
  profileId: string;
  organizationId: string;
  role: MemberRole;
  joinedAt: string;
  profile?: {
    name: string;
    avatarUrl: string | null;
  };
}

/**
 * Data transfer object for inviting a user
 */
export interface InviteUserDto {
  email: string;
  role: MemberRole;
}

/**
 * Invitation details response
 */
export interface InvitationResponse {
  id: string;
  email: string;
  role: MemberRole;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
  expiresAt: string;
  createdAt: string;
}
