import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminClient } from "./client";

/**
 * Query Keys
 */
export const adminKeys = {
  all: ["admin"] as const,
  users: (secret: string) => [...adminKeys.all, "users", secret] as const,
  userDetail: (secret: string, id: string) =>
    [...adminKeys.all, "user", id, secret] as const,
  organizations: (secret: string) =>
    [...adminKeys.all, "organizations", secret] as const,
  overview: (secret: string) => [...adminKeys.all, "overview", secret] as const,
  tokenUsage: (secret: string) =>
    [...adminKeys.all, "token-usage", secret] as const,
};

/**
 * useAdminUsers
 */
export const useAdminUsers = (
  secret: string,
  params?: { page?: number; limit?: number; search?: string }
) => {
  return useQuery({
    queryKey: [...adminKeys.users(secret), params],
    queryFn: () => adminClient.listUsers(secret, params),
    enabled: !!secret,
  });
};

/**
 * useAdminUser
 */
export const useAdminUser = (secret: string, id: string) => {
  return useQuery({
    queryKey: adminKeys.userDetail(secret, id),
    queryFn: () => adminClient.getUser(secret, id),
    enabled: !!secret && !!id,
  });
};

/**
 * useAdminBanUser
 */
export const useAdminBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      secret,
      id,
      banned,
    }: {
      secret: string;
      id: string;
      banned: boolean;
    }) => adminClient.banUser(secret, id, banned),
    onSuccess: (_, { secret, id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(secret, id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users(secret) });
    },
  });
};

/**
 * useAdminOrganizations
 */
export const useAdminOrganizations = (
  secret: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: [...adminKeys.organizations(secret), params],
    queryFn: () => adminClient.listOrganizations(secret, params),
    enabled: !!secret,
  });
};

/**
 * useAdminDeleteOrganization
 */
export const useAdminDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ secret, id }: { secret: string; id: string }) =>
      adminClient.deleteOrganization(secret, id),
    onSuccess: (_, { secret }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations(secret) });
    },
  });
};

/**
 * useAdminOverview
 */
export const useAdminOverview = (secret: string) => {
  return useQuery({
    queryKey: adminKeys.overview(secret),
    queryFn: () => adminClient.getOverview(secret),
    enabled: !!secret,
  });
};

/**
 * useAdminTokenUsage
 */
export const useAdminTokenUsage = (
  secret: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: [...adminKeys.tokenUsage(secret), params],
    queryFn: () => adminClient.getTokenUsage(secret, params),
    enabled: !!secret,
  });
};
