import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectQuery } from './get-project.query';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetProjectQuery): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: { id: query.id },
    });
    if (!project) throw new Error('Project not found');
    return project;
  }
}
