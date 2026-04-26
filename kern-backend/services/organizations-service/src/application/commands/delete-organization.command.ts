import { ICommand } from '@nestjs/cqrs';

export class DeleteOrganizationCommand implements ICommand {
  constructor(public readonly id: string) { }
}
