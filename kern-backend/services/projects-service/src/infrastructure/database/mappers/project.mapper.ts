import { Project as PrismaProject } from '@prisma/client';
import { Project } from '../../../domain/entities/project.entity';

export class ProjectMapper {
  static toDomain(prismaProject: PrismaProject): Project {
    return new Project(
      prismaProject.id,
      prismaProject.organizationId,
      prismaProject.name,
      prismaProject.description,
      prismaProject.color,
      prismaProject.isArchived,
      prismaProject.createdAt,
      prismaProject.updatedAt,
    );
  }

  static toPersistence(domainProject: Project): PrismaProject {
    return {
      id: domainProject.id,
      organizationId: domainProject.organizationId,
      name: domainProject.name,
      description: domainProject.description,
      color: domainProject.color,
      isArchived: domainProject.isArchived,
      createdAt: domainProject.createdAt,
      updatedAt: domainProject.updatedAt,
    };
  }
}
