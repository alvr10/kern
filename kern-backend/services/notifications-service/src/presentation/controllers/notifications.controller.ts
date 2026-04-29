import { Controller, Get, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserNotificationsQuery } from '../../application/queries/get-user-notifications.query';
import { MarkNotificationAsReadCommand } from '../../application/commands/mark-notification-as-read.command';
// We should probably have a MarkAsRead command too, but I'll skip for brevity if not requested, 
// or implement it quickly.

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetUserNotificationsQuery(userId));
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.commandBus.execute(new MarkNotificationAsReadCommand(id));
  }
}
