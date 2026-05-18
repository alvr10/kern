import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsClient } from './client';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: any) => [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export const useNotifications = (params?: { read?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: notificationKeys.list(params || {}),
    queryFn: () => notificationsClient.listNotifications(params),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsClient.getUnreadCount(),
    refetchInterval: 30000, // Check every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsClient.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsClient.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
