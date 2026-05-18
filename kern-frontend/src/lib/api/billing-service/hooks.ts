import { useQuery, useMutation } from "@tanstack/react-query";
import { billingClient } from "./client";

/**
 * Query Keys
 */
export const billingKeys = {
  all: ["billing"] as const,
  plans: () => [...billingKeys.all, "plans"] as const,
  plan: (id: string) => [...billingKeys.plans(), id] as const,
  subscription: (orgId: string) =>
    [...billingKeys.all, "subscription", orgId] as const,
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
    mutationFn: (dto: import("./types").CreateCheckoutDto) =>
      billingClient.createCheckoutSession(dto),
  });
};
