import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrganizationQuery } from './get-organization.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetOrganizationQuery)
export class GetOrganizationHandler implements IQueryHandler<GetOrganizationQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetOrganizationQuery): Promise<any> {
    const org = await this.prisma.organization.findUnique({
      where: { id: query.id, deletedAt: null },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    return org;
  }
}
