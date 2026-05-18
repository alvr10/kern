import { ICommand } from '@nestjs/cqrs';

export class UpdateOrganizationCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly logoUrl?: string,
    public readonly brandVoice?: Record<string, any>,
  ) {}
}
