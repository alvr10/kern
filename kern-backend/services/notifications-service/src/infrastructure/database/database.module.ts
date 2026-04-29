import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { NotificationDocument, NotificationSchema } from './schemas/notification.schema';
import { INotificationRepository } from '../../domain/repositories/notification.repository';
import { MongooseNotificationRepository } from './repositories/mongoose-notification.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/kern_notifications',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: NotificationDocument.name, schema: NotificationSchema }]),
  ],
  providers: [
    {
      provide: INotificationRepository,
      useClass: MongooseNotificationRepository,
    },
  ],
  exports: [INotificationRepository, MongooseModule],
})
export class DatabaseModule {}
