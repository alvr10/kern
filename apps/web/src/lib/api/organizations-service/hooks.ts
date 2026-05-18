import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationsClient } from './client';
import type {
  CreateOrganizationDto,
  InviteUserDto,
  MemberRole,
  UpdateOrganizationDto,
  TransferOwnershipDto,
} from './types';

/**
 * Query Keys
 */
export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  members: (id: string) => [...organizationKeys.detail(id), 'members'] as const,
};

/**
 * useOrganizations — List organizations the current user belongs to
 */
export const useOrganizations = () => {
  return useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: () => organizationsClient.listOrganizations(),
  });
};

/**
 * useOrganization — Get organization details
 */
export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationsClient.getOrganization(id),
    enabled: !!id,
  });
};

/**
 * useCreateOrganization
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationsClient.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

/**
 * useUpdateOrganization
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationDto }) =>
      organizationsClient.updateOrganization(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

/**
 * useDeleteOrganization
 */
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsClient.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

/**
 * useTransferOwnership
 */
export const useTransferOwnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransferOwnershipDto }) =>
      organizationsClient.transferOwnership(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(id) });
    },
  });
};

/**
 * useOrganizationMembers
 */
export const useOrganizationMembers = (id: string) => {
  return useQuery({
    queryKey: organizationKeys.members(id),
    queryFn: () => organizationsClient.listMembers(id),
    enabled: !!id,
  });
};

/**
 * useUpdateMemberRole
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memberId, role }: { id: string; memberId: string; role: MemberRole }) =>
      organizationsClient.updateMemberRole(id, memberId, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(id) });
    },
  });
};

/**
 * useRemoveMember
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memberId }: { id: string; memberId: string }) => organizationsClient.removeMember(id, memberId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(id) });
    },
  });
};

/**
 * useInviteUser
 */
export const useInviteUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InviteUserDto }) => organizationsClient.inviteUser(id, data),
  });
};

/**
 * useAcceptInvitation
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => organizationsClient.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};
