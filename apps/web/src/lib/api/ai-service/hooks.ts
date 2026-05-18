import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiClient } from './client';
import { billingKeys } from '../billing-service/hooks';
import type { AdaptContentDto, GenerateContentDto, ImproveContentDto, RewriteContentDto } from './types';

/**
 * Query Keys
 */
export const aiKeys = {
  all: ['ai'] as const,
  generations: (orgId: string) => [...aiKeys.all, 'generations', orgId] as const,
  tokenUsage: (orgId: string) => [...aiKeys.all, 'token-usage', orgId] as const,
  health: () => [...aiKeys.all, 'health'] as const,
};

/**
 * useAIHealth
 */
export const useAIHealth = () => {
  return useQuery({
    queryKey: aiKeys.health(),
    queryFn: () => aiClient.health(),
    refetchInterval: 30000, // Check every 30 seconds
  });
};

/**
 * useGenerateContent
 */
export const useGenerateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateContentDto) => aiClient.generate(data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.tokenUsage(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.generations(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: billingKeys.subscription(organizationId),
      });
    },
  });
};

/**
 * useRewriteContent
 */
export const useRewriteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RewriteContentDto) => aiClient.rewrite(data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.tokenUsage(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.generations(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: billingKeys.subscription(organizationId),
      });
    },
  });
};

/**
 * useImproveContent
 */
export const useImproveContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImproveContentDto) => aiClient.improve(data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.tokenUsage(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.generations(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: billingKeys.subscription(organizationId),
      });
    },
  });
};

/**
 * useAdaptContent
 */
export const useAdaptContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdaptContentDto) => aiClient.adapt(data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.tokenUsage(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.generations(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: billingKeys.subscription(organizationId),
      });
    },
  });
};

/**
 * useAIGenerations
 */
export const useAIGenerations = (organizationId: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...aiKeys.generations(organizationId), params],
    queryFn: () => aiClient.listGenerations(organizationId, params),
    enabled: !!organizationId,
  });
};

/**
 * useTokenUsage
 */
export const useTokenUsage = (organizationId: string) => {
  return useQuery({
    queryKey: aiKeys.tokenUsage(organizationId),
    queryFn: () => aiClient.getTokenUsage(organizationId),
    enabled: !!organizationId,
  });
};
