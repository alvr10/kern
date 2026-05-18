import { ICommand } from '@nestjs/cqrs';

export class CreateCheckoutSessionCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly planId: string,
    public readonly interval: 'monthly' | 'yearly',
    public readonly successUrl: string,
    public readonly cancelUrl: string,
  ) {}
}
