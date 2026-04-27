import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCheckoutSessionCommand } from '../../application/commands/create-checkout-session.command';
import { GetSubscriptionQuery } from '../../application/queries/get-subscription.query';

@Controller('billing/subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  async createCheckout(@Body() dto: { organizationId: string; planId: string; successUrl: string; cancelUrl: string }) {
    return this.commandBus.execute(
      new CreateCheckoutSessionCommand(dto.organizationId, dto.planId, dto.successUrl, dto.cancelUrl)
    );
  }

  @Get(':organizationId')
  async get(@Param('organizationId') organizationId: string) {
    return this.queryBus.execute(new GetSubscriptionQuery(organizationId));
  }
}
