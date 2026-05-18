import {
  Invitation as PrismaInvitation,
  InvitationStatus as PrismaInvitationStatus,
  MemberRole as PrismaMemberRole,
} from '@prisma/client';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { InvitationStatus } from '../../../domain/value-objects/invitation-status.vo';
import { MemberRole } from '../../../domain/value-objects/member-role.vo';

export class InvitationMapper {
  static toDomain(prismaInvitation: PrismaInvitation): Invitation {
    return new Invitation(
      prismaInvitation.id,
      prismaInvitation.organizationId,
      prismaInvitation.invitedById,
      prismaInvitation.email,
      prismaInvitation.role as unknown as MemberRole,
      prismaInvitation.token,
      prismaInvitation.status as unknown as InvitationStatus,
      prismaInvitation.expiresAt,
      prismaInvitation.acceptedAt,
      prismaInvitation.createdAt,
    );
  }

  static toPersistence(domainInvitation: Invitation): PrismaInvitation {
    return {
      id: domainInvitation.id,
      organizationId: domainInvitation.organizationId,
      invitedById: domainInvitation.invitedById,
      email: domainInvitation.email,
      role: domainInvitation.role as unknown as PrismaMemberRole,
      token: domainInvitation.token,
      status: domainInvitation.status as unknown as PrismaInvitationStatus,
      expiresAt: domainInvitation.expiresAt,
      acceptedAt: domainInvitation.acceptedAt,
      createdAt: domainInvitation.createdAt,
    };
  }
}
