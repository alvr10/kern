import { Injectable } from '@nestjs/common';
import { Membership } from '../../../domain/entities/membership.entity';
import { MembershipRepository } from '../../../domain/repositories/membership.repository';
import { MembershipMapper } from '../mappers/membership.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MembershipPrismaRepository implements MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Membership | null> {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
    });
    return membership ? MembershipMapper.toDomain(membership) : null;
  }

  async findByProfileAndOrganization(profileId: string, organizationId: string): Promise<Membership | null> {
    const membership = await this.prisma.membership.findUnique({
      where: { profileId_organizationId: { profileId, organizationId } },
    });
    return membership ? MembershipMapper.toDomain(membership) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<Membership[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { organizationId },
    });
    return memberships.map(MembershipMapper.toDomain);
  }

  async findByProfileId(profileId: string): Promise<Membership[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { profileId },
    });
    return memberships.map(MembershipMapper.toDomain);
  }

  async save(membership: Membership): Promise<void> {
    const data = MembershipMapper.toPersistence(membership);
    await this.prisma.membership.create({ data });
  }

  async update(membership: Membership): Promise<void> {
    const data = MembershipMapper.toPersistence(membership);
    await this.prisma.membership.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.membership.delete({
      where: { id },
    });
  }
}
