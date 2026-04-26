import { Membership as PrismaMembership, MemberRole as PrismaMemberRole } from '@prisma/client';
import { Membership } from '../../../domain/entities/membership.entity';
import { MemberRole } from '../../../domain/value-objects/member-role.vo';

export class MembershipMapper {
  static toDomain(prismaMembership: PrismaMembership): Membership {
    return new Membership(
      prismaMembership.id,
      prismaMembership.profileId,
      prismaMembership.organizationId,
      prismaMembership.role as unknown as MemberRole,
      prismaMembership.joinedAt,
      prismaMembership.updatedAt,
    );
  }

  static toPersistence(domainMembership: Membership): PrismaMembership {
    return {
      id: domainMembership.id,
      profileId: domainMembership.profileId,
      organizationId: domainMembership.organizationId,
      role: domainMembership.role as unknown as PrismaMemberRole,
      joinedAt: domainMembership.joinedAt,
      updatedAt: domainMembership.updatedAt,
    };
  }
}
