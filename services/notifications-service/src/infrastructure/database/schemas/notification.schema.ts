import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../../../domain/entities/notification.entity';

@Schema({ collection: 'notifications', timestamps: true })
export class NotificationDocument extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: NotificationType })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);
