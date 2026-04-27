import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
