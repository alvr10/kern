import { apiClient } from "../client";
import type {
  PlanResponse,
  SubscriptionResponse,
} from "./types";

/**
 * Billing Service API Client
 */
export const billingClient = {
  /**
   * List all available subscription plans
   */
  listPlans: (): Promise<PlanResponse[]> => {
    return apiClient.get<PlanResponse[]>("/billing/plans");
  },

  /**
   * Get a plan by ID
   */
  getPlan: (id: string): Promise<PlanResponse> => {
    return apiClient.get<PlanResponse>(`/billing/plans/${id}`);
  },

  /**
   * Get the current subscription for an organization
   */
  getSubscription: (organizationId: string): Promise<SubscriptionResponse> => {
    return apiClient.get<SubscriptionResponse>(
      `/billing/subscriptions/${organizationId}`,
    );
  },
  
  /**
   * Create a checkout session for a plan
   */
  createCheckoutSession: (dto: import("./types").CreateCheckoutDto): Promise<import("./types").CheckoutSessionResponse> => {
    return apiClient.post<import("./types").CheckoutSessionResponse>("/billing/subscriptions", dto);
  },
};
