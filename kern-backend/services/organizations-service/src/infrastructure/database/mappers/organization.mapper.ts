import { Organization as PrismaOrganization } from '@prisma/client';
import { Organization, BrandVoice } from '../../../domain/entities/organization.entity';

export class OrganizationMapper {
  static toDomain(prismaOrg: PrismaOrganization): Organization {
    return new Organization(
      prismaOrg.id,
      prismaOrg.name,
      prismaOrg.slug,
      prismaOrg.type as any,
      prismaOrg.ownerId,
      prismaOrg.logoUrl,
      prismaOrg.brandVoice ? (prismaOrg.brandVoice as unknown as BrandVoice) : null,
      prismaOrg.createdAt,
      prismaOrg.updatedAt,
      prismaOrg.deletedAt,
    );
  }

  static toPersistence(domainOrg: Organization): PrismaOrganization {
    return {
      id: domainOrg.id,
      name: domainOrg.name,
      slug: domainOrg.slug,
      type: domainOrg.type as any,
      ownerId: domainOrg.ownerId,
      logoUrl: domainOrg.logoUrl,
      brandVoice: domainOrg.brandVoice as any,
      createdAt: domainOrg.createdAt,
      updatedAt: domainOrg.updatedAt,
      deletedAt: domainOrg.deletedAt,
    };
  }
}
