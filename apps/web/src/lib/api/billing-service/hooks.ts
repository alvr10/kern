import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billingClient } from './client';
import type { CreateCheckoutDto } from './types';

/**
 * Query Keys
 */
export const billingKeys = {
  all: ['billing'] as const,
  plans: () => [...billingKeys.all, 'plans'] as const,
  plan: (id: string) => [...billingKeys.plans(), id] as const,
  subscription: (orgId: string) => [...billingKeys.all, 'subscription', orgId] as const,
};

/**
 * usePlans
 */
export const usePlans = () => {
  return useQuery({
    queryKey: billingKeys.plans(),
    queryFn: () => billingClient.listPlans(),
  });
};

/**
 * usePlan
 */
export const usePlan = (id: string) => {
  return useQuery({
    queryKey: billingKeys.plan(id),
    queryFn: () => billingClient.getPlan(id),
    enabled: !!id,
  });
};

/**
 * useSubscription
 */
export const useSubscription = (organizationId: string) => {
  return useQuery({
    queryKey: billingKeys.subscription(organizationId),
    queryFn: () => billingClient.getSubscription(organizationId),
    enabled: !!organizationId,
  });
};

/**
 * useCreateCheckoutSession
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: CreateCheckoutDto) => billingClient.createCheckoutSession(data),
    onSuccess: data => {
      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    },
  });
};

/**
 * useCancelSubscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => billingClient.cancelSubscription(organizationId),
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.subscription(data.organizationId),
      });
    },
  });
};
