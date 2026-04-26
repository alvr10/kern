import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrganizationsQuery } from './list-organizations.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(ListOrganizationsQuery)
export class ListOrganizationsHandler implements IQueryHandler<ListOrganizationsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListOrganizationsQuery): Promise<any[]> {
    // For queries, we bypass the domain layer and query Prisma directly for performance
    const memberships = await this.prisma.membership.findMany({
      where: { profileId: query.profileId },
      include: { organization: true },
    });

    return memberships
      .filter(m => m.organization.deletedAt === null)
      .map(m => m.organization);
  }
}
