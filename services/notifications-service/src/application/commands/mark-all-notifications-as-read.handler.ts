import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkAllNotificationsAsReadCommand } from './mark-all-notifications-as-read.command';
import { INotificationRepository } from '../../domain/repositories/notification.repository';

@CommandHandler(MarkAllNotificationsAsReadCommand)
export class MarkAllNotificationsAsReadHandler implements ICommandHandler<MarkAllNotificationsAsReadCommand> {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: MarkAllNotificationsAsReadCommand): Promise<void> {
    await this.notificationRepository.markAllAsRead(command.userId, command.userEmail);
  }
}
