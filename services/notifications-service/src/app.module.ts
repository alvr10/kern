import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { DiscoveryClientModule, MetricsModule } from '@kern/core-backend';
import { DatabaseModule } from './infrastructure/database/database.module';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { OrganizationEventConsumer } from './presentation/consumers/organization-event.consumer';
import { CreateNotificationHandler } from './application/commands/create-notification.handler';
import { MarkNotificationAsReadHandler } from './application/commands/mark-notification-as-read.handler';
import { MarkAllNotificationsAsReadHandler } from './application/commands/mark-all-notifications-as-read.handler';
import { GetUserNotificationsHandler } from './application/queries/get-user-notifications.handler';
import { GetUnreadCountHandler } from './application/queries/get-unread-count.handler';

const CommandHandlers = [CreateNotificationHandler, MarkNotificationAsReadHandler, MarkAllNotificationsAsReadHandler];
const QueryHandlers = [GetUserNotificationsHandler, GetUnreadCountHandler];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CqrsModule, DatabaseModule, DiscoveryClientModule, MetricsModule],
  controllers: [NotificationsController, HealthController, OrganizationEventConsumer],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class AppModule {}
