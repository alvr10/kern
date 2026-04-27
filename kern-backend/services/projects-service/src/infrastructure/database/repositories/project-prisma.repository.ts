import { Injectable } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { ProjectMapper } from '../mappers/project.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectPrismaRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    return project ? ProjectMapper.toDomain(project) : null;
  }

  async findByOrganizationId(organizationId: string, archived: boolean = false): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { organizationId, isArchived: archived },
    });
    return projects.map(ProjectMapper.toDomain);
  }

  async save(project: Project): Promise<void> {
    const data = ProjectMapper.toPersistence(project);
    await this.prisma.project.create({ data });
  }

  async update(project: Project): Promise<void> {
    const data = ProjectMapper.toPersistence(project);
    await this.prisma.project.update({
      where: { id: data.id },
      data,
    });
  }
}
