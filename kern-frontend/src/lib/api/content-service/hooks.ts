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
  lists: (organizationId: string) =>
    [...contentKeys.all, "list", organizationId] as const,
  details: () => [...contentKeys.all, "detail"] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
  kanban: (organizationId: string) =>
    [...contentKeys.all, "kanban", organizationId] as const,
  calendar: (organizationId: string, from: string, to: string) =>
    [...contentKeys.all, "calendar", organizationId, from, to] as const,
  comments: (id: string) => [...contentKeys.detail(id), "comments"] as const,
};

/**
 * useContentList
 */
export const useContentList = (params: {
  organizationId: string;
  status?: ContentStatus;
  platform?: SocialPlatform;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...contentKeys.lists(params.organizationId), params],
    queryFn: () => contentClient.listContent(params),
    enabled: !!params.organizationId,
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
export const useKanbanBoard = (organizationId: string) => {
  return useQuery({
    queryKey: contentKeys.kanban(organizationId),
    queryFn: () => contentClient.getKanban(organizationId),
    enabled: !!organizationId,
  });
};

/**
 * useContentCalendar
 */
export const useContentCalendar = (
  organizationId: string,
  from: string,
  to: string,
) => {
  return useQuery({
    queryKey: contentKeys.calendar(organizationId, from, to),
    queryFn: () => contentClient.getCalendar(organizationId, from, to),
    enabled: !!organizationId && !!from && !!to,
  });
};

/**
 * useCreateContent
 */
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContentDto) => contentClient.createContent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(data.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.organizationId),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(data.id || data._id),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(data.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.organizationId),
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
    mutationFn: ({ id }: { id: string; organizationId: string }) =>
      contentClient.deleteContent(id),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(organizationId),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(data.id || data._id),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.lists(data.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.organizationId),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(data.id || data._id),
      });
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
