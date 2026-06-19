import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';

@Injectable()
export class StripeClient implements OnModuleInit {
  private stripe: StripeType;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-01-27.acacia' as any,
      maxNetworkRetries: 3,
      timeout: 10000,
    });
  }

  async createCheckoutSession(params: {
    customerId?: string;
    organizationId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: params.customerId,
      client_reference_id: params.organizationId,
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        organizationId: params.organizationId,
      },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  constructEvent(payload: string | Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }
}
