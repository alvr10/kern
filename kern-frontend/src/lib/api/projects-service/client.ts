import { apiClient } from "../client";
import type {
  CreateProjectDto,
  ProjectResponse,
  UpdateProjectDto,
} from "./types";

/**
 * Projects Service API Client
 */
export const projectsClient = {
  /**
   * List projects for an organization
   */
  listProjects: (
    organizationId: string,
    archived: boolean = false
  ): Promise<ProjectResponse[]> => {
    return apiClient.get<ProjectResponse[]>("/projects", {
      params: { organizationId, archived },
    });
  },

  /**
   * Create a new project
   */
  createProject: (data: CreateProjectDto): Promise<ProjectResponse> => {
    return apiClient.post<ProjectResponse>("/projects", data);
  },

  /**
   * Get a project by ID
   */
  getProject: (id: string): Promise<ProjectResponse> => {
    return apiClient.get<ProjectResponse>(`/projects/${id}`);
  },

  /**
   * Update a project
   */
  updateProject: (id: string, data: UpdateProjectDto): Promise<ProjectResponse> => {
    return apiClient.patch<ProjectResponse>(`/projects/${id}`, data);
  },

  /**
   * Archive a project (soft-delete)
   */
  archiveProject: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/projects/${id}`);
  },
};
