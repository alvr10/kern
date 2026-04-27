import { Controller, Post, Req, Headers, BadRequestException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HandleStripeWebhookCommand } from '../../application/commands/handle-stripe-webhook.command';
import { Request } from 'express';

@Controller('billing/webhooks')
export class WebhooksController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('stripe')
  async handleStripe(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    // We need the raw body for Stripe webhook verification
    const payload = (req as any).rawBody || req.body;
    return this.commandBus.execute(new HandleStripeWebhookCommand(payload, signature));
  }
}
