import { Controller, Get, Param, Patch, Headers } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserNotificationsQuery } from '../../application/queries/get-user-notifications.query';
import { GetUnreadCountQuery } from '../../application/queries/get-unread-count.query';
import { MarkNotificationAsReadCommand } from '../../application/commands/mark-notification-as-read.command';
import { MarkAllNotificationsAsReadCommand } from '../../application/commands/mark-all-notifications-as-read.command';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getNotifications(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-email') userEmail?: string,
  ): Promise<NotificationResponseDto[]> {
    return this.queryBus.execute(new GetUserNotificationsQuery(userId, userEmail));
  }

  @Get('unread-count')
  async getUnreadCount(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-email') userEmail?: string,
  ): Promise<{ count: number }> {
    return this.queryBus.execute(new GetUnreadCountQuery(userId, userEmail));
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<NotificationResponseDto[]> {
    return this.queryBus.execute(new GetUserNotificationsQuery(userId));
  }

  @Patch('read-all')
  async markAllAsRead(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-email') userEmail?: string,
  ): Promise<void> {
    await this.commandBus.execute(new MarkAllNotificationsAsReadCommand(userId, userEmail));
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new MarkNotificationAsReadCommand(id));
  }
}
