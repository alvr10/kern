import { ICommand } from '@nestjs/cqrs';
import { MemberRole } from '../../domain/value-objects/member-role.vo';

export class InviteUserCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly invitedById: string,
    public readonly email: string,
    public readonly role: MemberRole,
  ) {}
}
