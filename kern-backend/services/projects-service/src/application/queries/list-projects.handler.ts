import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProjectsQuery } from './list-projects.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<ListProjectsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListProjectsQuery): Promise<any[]> {
    return this.prisma.project.findMany({
      where: {
        organizationId: query.organizationId,
        isArchived: query.archived,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
