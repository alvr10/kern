import { apiClient } from "../client";
import type {
  CheckoutSessionResponse,
  CreateCheckoutDto,
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
      `/billing/subscriptions/${organizationId}`
    );
  },

  /**
   * Create a Stripe Checkout session to start a subscription
   */
  createCheckoutSession: (
    data: CreateCheckoutDto
  ): Promise<CheckoutSessionResponse> => {
    return apiClient.post<CheckoutSessionResponse>(
      "/billing/subscriptions",
      data
    );
  },

  /**
   * Cancel the subscription at period end
   */
  cancelSubscription: (
    organizationId: string
  ): Promise<SubscriptionResponse> => {
    return apiClient.post<SubscriptionResponse>(
      `/billing/subscriptions/${organizationId}/cancel`
    );
  },
};
