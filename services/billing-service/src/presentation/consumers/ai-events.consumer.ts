import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { DeductTokensCommand } from '../../application/commands/deduct-tokens.command';

@Controller()
export class AiEventsConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('ai.tokens_consumed')
  async handleTokensConsumed(@Payload() data: { organizationId: string; tokens: number }) {
    console.log(`[billing-service] 📉 Received token deduction: ${data.tokens} for org ${data.organizationId}`);
    await this.commandBus.execute(new DeductTokensCommand(data.organizationId, data.tokens));
  }
}
