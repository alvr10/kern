import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, userEmail?: string): Promise<Notification[]>;
  countUnreadByUserId(userId: string, userEmail?: string): Promise<number>;
  markAllAsRead(userId: string, userEmail?: string): Promise<void>;
  markAsRead(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export const INotificationRepository = Symbol('INotificationRepository');
