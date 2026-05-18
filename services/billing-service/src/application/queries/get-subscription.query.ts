import { IQuery } from '@nestjs/cqrs';

export class GetSubscriptionQuery implements IQuery {
  constructor(public readonly organizationId: string) {}
}
