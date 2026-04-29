import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMembersQuery } from './list-members.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(ListMembersQuery)
export class ListMembersHandler implements IQueryHandler<ListMembersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListMembersQuery): Promise<any[]> {
    const members = await this.prisma.membership.findMany({
      where: { organizationId: query.organizationId },
      include: { profile: true },
    });

    return members;
  }
}
