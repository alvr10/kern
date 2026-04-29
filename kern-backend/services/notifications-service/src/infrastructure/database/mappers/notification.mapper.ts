import { Notification, NotificationType } from '../../../domain/entities/notification.entity';
import { NotificationDocument } from '../schemas/notification.schema';

export class NotificationMapper {
  public static toDomain(document: NotificationDocument): Notification {
    return Notification.hydrate(
      {
        userId: document.userId,
        type: document.type as NotificationType,
        title: document.title,
        message: document.message,
        isRead: document.isRead,
        metadata: document.metadata,
        createdAt: document.createdAt,
      },
      document._id.toString(),
    );
  }

  public static toPersistence(notification: Notification): any {
    const json = notification.toJSON();
    return {
      userId: json.userId,
      type: json.type,
      title: json.title,
      message: json.message,
      isRead: json.isRead,
      metadata: json.metadata,
      createdAt: json.createdAt,
    };
  }
}
