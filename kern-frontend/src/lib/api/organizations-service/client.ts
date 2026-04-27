import { apiClient } from "../client";
import type {
  CreateOrganizationDto,
  InvitationResponse,
  InviteUserDto,
  MembershipResponse,
  MemberRole,
  OrganizationResponse,
  UpdateOrganizationDto,
} from "./types";

/**
 * Organizations Service API Client
 */
export const organizationsClient = {
  /**
   * List organizations the current user belongs to
   */
  listOrganizations: (): Promise<OrganizationResponse[]> => {
    return apiClient.get<OrganizationResponse[]>("/organizations");
  },

  /**
   * Create a new organization
   */
  createOrganization: (
    data: CreateOrganizationDto,
  ): Promise<OrganizationResponse> => {
    return apiClient.post<OrganizationResponse>("/organizations", data);
  },

  /**
   * Get an organization by ID
   */
  getOrganization: (id: string): Promise<OrganizationResponse> => {
    return apiClient.get<OrganizationResponse>(`/organizations/${id}`);
  },

  /**
   * Update an organization
   */
  updateOrganization: (
    id: string,
    data: UpdateOrganizationDto,
  ): Promise<OrganizationResponse> => {
    return apiClient.patch<OrganizationResponse>(`/organizations/${id}`, data);
  },

  /**
   * Soft-delete an organization
   */
  deleteOrganization: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/organizations/${id}`);
  },

  /**
   * List members of an organization
   */
  listMembers: (id: string): Promise<MembershipResponse[]> => {
    return apiClient.get<MembershipResponse[]>(`/organizations/${id}/members`);
  },

  /**
   * Update a member's role
   */
  updateMemberRole: (
    id: string,
    memberId: string,
    role: MemberRole,
  ): Promise<MembershipResponse> => {
    return apiClient.patch<MembershipResponse>(
      `/organizations/${id}/members/${memberId}`,
      { role },
    );
  },

  /**
   * Remove a member from an organization
   */
  removeMember: (id: string, memberId: string): Promise<void> => {
    return apiClient.delete<void>(`/organizations/${id}/members/${memberId}`);
  },

  /**
   * Invite a user to an organization
   */
  inviteUser: (
    id: string,
    data: InviteUserDto,
  ): Promise<InvitationResponse> => {
    return apiClient.post<InvitationResponse>(
      `/organizations/${id}/invitations`,
      data,
    );
  },

  /**
   * Accept an invitation by token
   */
  acceptInvitation: (token: string): Promise<void> => {
    return apiClient.post<void>(`/invitations/${token}/accept`);
  },
};
