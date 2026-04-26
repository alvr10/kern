import { ICommand } from '@nestjs/cqrs';

export class CreateOrganizationCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly logoUrl?: string,
  ) {}
}
