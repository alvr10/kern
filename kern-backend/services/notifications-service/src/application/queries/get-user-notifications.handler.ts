import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserNotificationsQuery } from './get-user-notifications.query';
import { INotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationProps } from '../../domain/entities/notification.entity';

@QueryHandler(GetUserNotificationsQuery)
export class GetUserNotificationsHandler implements IQueryHandler<GetUserNotificationsQuery> {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(query: GetUserNotificationsQuery): Promise<NotificationProps[]> {
    const notifications = await this.notificationRepository.findByUserId(query.userId);
    return notifications.map((n) => n.toJSON());
  }
}
