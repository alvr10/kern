import { ICommand } from '@nestjs/cqrs';
import { MemberRole } from '../../domain/value-objects/member-role.vo';

export class UpdateMemberRoleCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly memberId: string,
    public readonly role: MemberRole,
  ) {}
}
