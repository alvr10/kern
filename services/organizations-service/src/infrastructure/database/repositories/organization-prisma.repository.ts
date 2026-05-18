import { Injectable } from '@nestjs/common';
import { Organization } from '../../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../../domain/repositories/organization.repository';
import { OrganizationMapper } from '../mappers/organization.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationPrismaRepository implements OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { id, deletedAt: null },
    });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { slug, deletedAt: null },
    });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async save(organization: Organization): Promise<void> {
    const data = OrganizationMapper.toPersistence(organization);
    await this.prisma.organization.create({ data });
  }

  async update(organization: Organization): Promise<void> {
    const data = OrganizationMapper.toPersistence(organization);
    await this.prisma.organization.update({
      where: { id: data.id },
      data,
    });
  }
}
