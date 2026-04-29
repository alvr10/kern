export enum NotificationType {
  INVITATION = 'INVITATION',
  SYSTEM = 'SYSTEM',
}

export interface NotificationProps {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class Notification {
  private constructor(private readonly props: NotificationProps, private readonly _id?: string) {}

  public static create(props: Omit<NotificationProps, 'isRead' | 'createdAt'>, id?: string): Notification {
    return new Notification(
      {
        ...props,
        isRead: false,
        createdAt: new Date(),
      },
      id,
    );
  }

  public static hydrate(props: NotificationProps, id: string): Notification {
    return new Notification(props, id);
  }

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get message(): string {
    return this.props.message;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public markAsRead(): void {
    this.props.isRead = true;
  }

  public toJSON(): NotificationProps & { id?: string } {
    return {
      id: this._id,
      ...this.props,
    };
  }
}
