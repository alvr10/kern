import { ICommand } from '@nestjs/cqrs';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly color?: string,
  ) {}
}
