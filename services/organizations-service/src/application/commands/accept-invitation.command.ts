import { ICommand } from '@nestjs/cqrs';

export class AcceptInvitationCommand implements ICommand {
  constructor(
    public readonly token: string,
    public readonly profileId: string,
  ) {}
}
