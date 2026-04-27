import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsClient } from "./client";
import type { CreateProjectDto, UpdateProjectDto } from "./types";

/**
 * Query Keys
 */
export const projectKeys = {
  all: ["projects"] as const,
  lists: (orgId: string) => [...projectKeys.all, "list", orgId] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * useProjects
 */
export const useProjects = (
  organizationId: string,
  archived: boolean = false,
) => {
  return useQuery({
    queryKey: [...projectKeys.lists(organizationId), { archived }],
    queryFn: () => projectsClient.listProjects(organizationId, archived),
    enabled: !!organizationId,
  });
};

/**
 * useProject
 */
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsClient.getProject(id),
    enabled: !!id,
  });
};

/**
 * useCreateProject
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectsClient.createProject(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(data.organizationId),
      });
    },
  });
};

/**
 * useUpdateProject
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectsClient.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(data.organizationId),
      });
    },
  });
};

/**
 * useArchiveProject
 */
export const useArchiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      organizationId,
    }: {
      id: string;
      organizationId: string;
    }) => projectsClient.archiveProject(id),
    onSuccess: (_, { organizationId, id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(organizationId),
      });
    },
  });
};
