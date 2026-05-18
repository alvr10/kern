/**
 * Billing Service Types
 * TypeScript types for subscription plans, organization subscriptions, and checkout sessions
 */

/**
 * Subscription plan response model
 */
export interface PlanResponse {
  id: string;
  name: string;
  slug: string;
  monthlyTokenLimit: number;
  memberLimit: number;
  organizationLimit: number;
  priceMonthlyUsd: number;
  features: string[];
  isActive: boolean;
}

/**
 * Subscription status enum
 */
export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

/**
 * Organization subscription response model
 */
export interface SubscriptionResponse {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  tokensUsed: number;
  tokensLimit: number;
  stripeCancelAtPeriodEnd: boolean;
  stripeCurrentPeriodEnd: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data transfer object for creating a checkout session
 */
export interface CreateCheckoutDto {
  organizationId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Checkout session response model
 */
export interface CheckoutSessionResponse {
  checkoutUrl: string;
}
