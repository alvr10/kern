import { Notification, NotificationType } from '../../domain/entities/notification.entity';

export class NotificationResponseDto {
  readonly id: string;
  readonly userId: string;
  readonly organizationId: string | null;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly read: boolean;
  readonly metadata: Record<string, any> | null;
  readonly createdAt: string;

  private constructor(props: {
    id: string;
    userId: string;
    organizationId: string | null;
    type: NotificationType;
    title: string;
    body: string;
    read: boolean;
    metadata: Record<string, any> | null;
    createdAt: string;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.organizationId = props.organizationId;
    this.type = props.type;
    this.title = props.title;
    this.body = props.body;
    this.read = props.read;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
  }

  public static fromDomain(notification: Notification): NotificationResponseDto {
    const json = notification.toJSON();
    return new NotificationResponseDto({
      id: json.id || '',
      userId: json.userId,
      organizationId: json.metadata?.organizationId || null,
      type: json.type,
      title: json.title,
      body: json.message,
      read: json.isRead,
      metadata: json.metadata || null,
      createdAt: json.createdAt instanceof Date ? json.createdAt.toISOString() : new Date(json.createdAt).toISOString(),
    });
  }
}
