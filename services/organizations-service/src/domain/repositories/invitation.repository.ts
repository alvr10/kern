import { Invitation } from '../entities/invitation.entity';

export const INVITATION_REPOSITORY = Symbol('INVITATION_REPOSITORY');

export interface InvitationRepository {
  findById(id: string): Promise<Invitation | null>;
  findByToken(token: string): Promise<Invitation | null>;
  findByOrganizationId(organizationId: string): Promise<Invitation[]>;
  save(invitation: Invitation): Promise<void>;
  update(invitation: Invitation): Promise<void>;
}
