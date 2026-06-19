import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../../domain/entities/notification.entity';
import { INotificationRepository } from '../../../domain/repositories/notification.repository';
import { NotificationDocument } from '../schemas/notification.schema';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class MongooseNotificationRepository implements INotificationRepository {
  constructor(
    @InjectModel(NotificationDocument.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async save(notification: Notification): Promise<void> {
    const persistence = NotificationMapper.toPersistence(notification);
    if (notification.id) {
      await this.notificationModel.findByIdAndUpdate(notification.id, persistence);
    } else {
      await this.notificationModel.create(persistence);
    }
  }

  async findById(id: string): Promise<Notification | null> {
    const document = await this.notificationModel.findById(id).exec();
    return document ? NotificationMapper.toDomain(document) : null;
  }

  async findByUserId(userId: string, userEmail?: string): Promise<Notification[]> {
    const query = userEmail ? { $or: [{ userId }, { userId: userEmail }] } : { userId };
    const documents = await this.notificationModel.find(query).sort({ createdAt: -1 }).exec();
    return documents.map(NotificationMapper.toDomain);
  }

  async countUnreadByUserId(userId: string, userEmail?: string): Promise<number> {
    const query = userEmail ? { $or: [{ userId }, { userId: userEmail }], isRead: false } : { userId, isRead: false };
    return this.notificationModel.countDocuments(query).exec();
  }

  async markAllAsRead(userId: string, userEmail?: string): Promise<void> {
    const query = userEmail ? { $or: [{ userId }, { userId: userEmail }], isRead: false } : { userId, isRead: false };
    await this.notificationModel.updateMany(query, { isRead: true }).exec();
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(id, { isRead: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id).exec();
  }
}
