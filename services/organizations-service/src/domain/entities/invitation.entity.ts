import { InvitationStatus } from '../value-objects/invitation-status.vo';
import { MemberRole } from '../value-objects/member-role.vo';

export class Invitation {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly invitedById: string,
    public readonly email: string,
    public readonly role: MemberRole,
    public readonly token: string,
    public status: InvitationStatus,
    public readonly expiresAt: Date,
    public acceptedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  public isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  public accept(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Invitation is not pending');
    }
    if (this.isExpired()) {
      this.status = InvitationStatus.EXPIRED;
      throw new Error('Invitation is expired');
    }
    this.status = InvitationStatus.ACCEPTED;
    this.acceptedAt = new Date();
  }

  public revoke(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Can only revoke pending invitations');
    }
    this.status = InvitationStatus.REVOKED;
  }
}
