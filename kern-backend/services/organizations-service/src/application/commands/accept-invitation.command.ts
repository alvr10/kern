import { ICommand } from '@nestjs/cqrs';

export class AcceptInvitationCommand {
  constructor(
    public readonly token: string,
    public readonly profileId: string,
  ) {}
}
