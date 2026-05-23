import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserNotificationsQuery } from './get-user-notifications.query';
import { INotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationResponseDto } from '../dtos/notification-response.dto';

@QueryHandler(GetUserNotificationsQuery)
export class GetUserNotificationsHandler implements IQueryHandler<GetUserNotificationsQuery> {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(query: GetUserNotificationsQuery): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.findByUserId(query.userId, query.userEmail);
    return notifications.map(NotificationResponseDto.fromDomain);
  }
}
