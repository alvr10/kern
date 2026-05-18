import { apiClient } from '../client';

export enum NotificationType {
  INVITATION = 'INVITATION',
  TOKEN_ALERT_80 = 'TOKEN_ALERT_80',
  TOKEN_ALERT_100 = 'TOKEN_ALERT_100',
  CONTENT_APPROVED = 'CONTENT_APPROVED',
  CONTENT_REJECTED = 'CONTENT_REJECTED',
  PLAN_UPGRADED = 'PLAN_UPGRADED',
}

export interface NotificationResponse {
  id: string;
  userId: string;
  organizationId: string | null;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedNotificationsResponse {
  data: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
}

export const notificationsClient = {
  listNotifications: (params?: {
    read?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedNotificationsResponse> => {
    return apiClient.get<PaginatedNotificationsResponse>('/notifications', {
      params,
    });
  },
  getUnreadCount: (): Promise<{ count: number }> => {
    return apiClient.get<{ count: number }>('/notifications/unread-count');
  },
  markAsRead: (id: string): Promise<NotificationResponse> => {
    return apiClient.patch<NotificationResponse>(`/notifications/${id}/read`, {});
  },
  markAllAsRead: (): Promise<void> => {
    return apiClient.patch<void>('/notifications/read-all', {});
  },
};
