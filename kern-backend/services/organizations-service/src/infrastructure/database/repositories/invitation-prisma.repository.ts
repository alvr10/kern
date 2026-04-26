import { Injectable } from '@nestjs/common';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { InvitationRepository } from '../../../domain/repositories/invitation.repository';
import { InvitationMapper } from '../mappers/invitation.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InvitationPrismaRepository implements InvitationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });
    return invitation ? InvitationMapper.toDomain(invitation) : null;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });
    return invitation ? InvitationMapper.toDomain(invitation) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { organizationId },
    });
    return invitations.map(InvitationMapper.toDomain);
  }

  async save(invitation: Invitation): Promise<void> {
    const data = InvitationMapper.toPersistence(invitation);
    await this.prisma.invitation.create({ data });
  }

  async update(invitation: Invitation): Promise<void> {
    const data = InvitationMapper.toPersistence(invitation);
    await this.prisma.invitation.update({
      where: { id: data.id },
      data,
    });
  }
}
