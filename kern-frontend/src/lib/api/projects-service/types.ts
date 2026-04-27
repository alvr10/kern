/**
 * Projects Service Types
 * TypeScript types for project management within organizations
 */

/**
 * Data transfer object for creating a project
 */
export interface CreateProjectDto {
  organizationId: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

/**
 * Data transfer object for updating a project
 */
export interface UpdateProjectDto {
  name?: string;
  description?: string | null;
  color?: string | null;
}

/**
 * Project response model
 */
export interface ProjectResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  color: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
