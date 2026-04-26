import { Membership } from '../entities/membership.entity';

export const MEMBERSHIP_REPOSITORY = Symbol('MEMBERSHIP_REPOSITORY');

export interface MembershipRepository {
  findById(id: string): Promise<Membership | null>;
  findByProfileAndOrganization(profileId: string, organizationId: string): Promise<Membership | null>;
  findByOrganizationId(organizationId: string): Promise<Membership[]>;
  findByProfileId(profileId: string): Promise<Membership[]>;
  save(membership: Membership): Promise<void>;
  update(membership: Membership): Promise<void>;
  delete(id: string): Promise<void>;
}
