import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SocialPlatform } from "../types";
import { contentClient } from "./client";
import type {
  ContentStatus,
  CreateCommentDto,
  CreateContentDto,
  CreateReviewDto,
  UpdateContentDto,
} from "./types";

/**
 * Query Keys
 */
export const contentKeys = {
  all: ["content"] as const,
  lists: (projectId: string) =>
    [...contentKeys.all, "list", projectId] as const,
  details: () => [...contentKeys.all, "detail"] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
  kanban: (projectId: string) =>
    [...contentKeys.all, "kanban", projectId] as const,
  calendar: (projectId: string, from: string, to: string) =>
    [...contentKeys.all, "calendar", projectId, from, to] as const,
  comments: (id: string) => [...contentKeys.detail(id), "comments"] as const,
};

/**
 * useContentList
 */
export const useContentList = (params: {
  projectId: string;
  status?: ContentStatus;
  platform?: SocialPlatform;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...contentKeys.lists(params.projectId), params],
    queryFn: () => contentClient.listContent(params),
    enabled: !!params.projectId,
  });
};

/**
 * useContent
 */
export const useContent = (id: string) => {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentClient.getContent(id),
    enabled: !!id,
  });
};

/**
 * useKanbanBoard
 */
export const useKanbanBoard = (projectId: string) => {
  return useQuery({
    queryKey: contentKeys.kanban(projectId),
    queryFn: () => contentClient.getKanban(projectId),
    enabled: !!projectId,
  });
};

/**
 * useContentCalendar
 */
export const useContentCalendar = (
  projectId: string,
  from: string,
  to: string,
) => {
  return useQuery({
    queryKey: contentKeys.calendar(projectId, from, to),
    queryFn: () => contentClient.getCalendar(projectId, from, to),
    enabled: !!projectId && !!from && !!to,
  });
};

/**
 * useCreateContent
 */
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContentDto) => contentClient.createContent(data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists(projectId) });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(projectId),
      });
    },
  });
};

/**
 * useUpdateContent
 */
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentDto }) =>
      contentClient.updateContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(data.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.projectId),
      });
    },
  });
};

/**
 * useDeleteContent
 */
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      contentClient.deleteContent(id),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists(projectId) });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(projectId),
      });
    },
  });
};

/**
 * useUpdateContentStatus
 */
export const useUpdateContentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      contentClient.updateStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(data.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.projectId),
      });
    },
  });
};

/**
 * useSubmitReview
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateReviewDto }) =>
      contentClient.submitReview(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(data.id) });
    },
  });
};

/**
 * useContentComments
 */
export const useContentComments = (id: string) => {
  return useQuery({
    queryKey: contentKeys.comments(id),
    queryFn: () => contentClient.listComments(id),
    enabled: !!id,
  });
};

/**
 * useAddComment
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCommentDto }) =>
      contentClient.addComment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.comments(id) });
    },
  });
};
