import { MemberRole } from '../value-objects/member-role.vo';

export class Membership {
  constructor(
    public readonly id: string,
    public readonly profileId: string,
    public readonly organizationId: string,
    public role: MemberRole,
    public readonly joinedAt: Date,
    public updatedAt: Date,
  ) {}

  public updateRole(newRole: MemberRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }
}
