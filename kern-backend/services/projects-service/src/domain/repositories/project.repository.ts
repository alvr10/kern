import { Project } from '../entities/project.entity';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findByOrganizationId(organizationId: string, archived?: boolean): Promise<Project[]>;
  save(project: Project): Promise<void>;
  update(project: Project): Promise<void>;
}
