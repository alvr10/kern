import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NOTIFICATION_TYPE_VALUES, NotificationType } from '@kern/shared';

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'notifications' })
export class Notification {
  @Prop({ required: true, index: true })
  profileId: string;

  @Prop({ index: true })
  organizationId?: string;

  @Prop({ type: String, enum: NOTIFICATION_TYPE_VALUES, required: true })
  type: NotificationType;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ index: true })
  readAt?: Date;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ profileId: 1, createdAt: -1 });
NotificationSchema.index({ profileId: 1, readAt: 1 });
