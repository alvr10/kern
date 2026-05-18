import { NotificationType } from '../../domain/entities/notification.entity';

export class CreateNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly metadata?: Record<string, any>,
  ) {}
}
