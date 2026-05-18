import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socialClient } from "./client";
import type { ConnectSocialAccountDto } from "./types";

/**
 * Query Keys
 */
export const socialKeys = {
  all: ["social"] as const,
  accounts: (orgId: string) => [...socialKeys.all, "accounts", orgId] as const,
};

/**
 * useSocialAccounts
 */
export const useSocialAccounts = (organizationId: string) => {
  return useQuery({
    queryKey: socialKeys.accounts(organizationId),
    queryFn: () => socialClient.listAccounts(organizationId),
    enabled: !!organizationId,
  });
};

/**
 * useConnectSocialAccount
 */
export const useConnectSocialAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectSocialAccountDto) =>
      socialClient.connectAccount(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.accounts(data.organizationId),
      });
    },
  });
};

/**
 * useDisconnectSocialAccount
 */
export const useDisconnectSocialAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      organizationId,
    }: {
      id: string;
      organizationId: string;
    }) => socialClient.disconnectAccount(id),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.accounts(organizationId),
      });
    },
  });
};

/**
 * usePublishNow
 */
export const usePublishNow = () => {
  return useMutation({
    mutationFn: (contentPieceId: string) =>
      socialClient.publishNow(contentPieceId),
  });
};
