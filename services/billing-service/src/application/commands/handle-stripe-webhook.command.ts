import { ICommand } from '@nestjs/cqrs';

export class HandleStripeWebhookCommand implements ICommand {
  constructor(
    public readonly payload: Buffer,
    public readonly signature: string,
  ) {}
}
