import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkNotificationAsReadCommand } from './mark-notification-as-read.command';
import { INotificationRepository } from '../../domain/repositories/notification.repository';

@CommandHandler(MarkNotificationAsReadCommand)
export class MarkNotificationAsReadHandler implements ICommandHandler<MarkNotificationAsReadCommand> {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: MarkNotificationAsReadCommand): Promise<void> {
    await this.notificationRepository.markAsRead(command.id);
  }
}
