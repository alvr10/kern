import { Controller, Get, Patch, Param, Query, Headers, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../infrastructure/database/schemas/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  @Get()
  async list(
    @Headers('x-user-id') profileId: string,
    @Query('read') read?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const query: any = { profileId };
    if (read !== undefined) {
      query.readAt = read === 'true' ? { $ne: null } : null;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query),
    ]);

    // Map to response DTO format
    const mappedData = data.map((n) => ({
      id: n._id,
      userId: n.profileId,
      organizationId: n.organizationId,
      type: n.type,
      title: n.type.replace(/_/g, ' '), // Basic title generation
      body: n.body,
      read: !!n.readAt,
      metadata: n.metadata,
      createdAt: (n as any).createdAt,
    }));

    return {
      data: mappedData,
      total,
      page,
      limit,
    };
  }

  @Get('unread-count')
  async getUnreadCount(@Headers('x-user-id') profileId: string) {
    const count = await this.notificationModel.countDocuments({
      profileId,
      readAt: null,
    });
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(
    @Headers('x-user-id') profileId: string,
    @Param('id') id: string,
  ) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, profileId },
      { readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      return null;
    }

    return {
      id: notification._id,
      userId: notification.profileId,
      organizationId: notification.organizationId,
      type: notification.type,
      title: notification.type.replace(/_/g, ' '),
      body: notification.body,
      read: !!notification.readAt,
      metadata: notification.metadata,
      createdAt: (notification as any).createdAt,
    };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Headers('x-user-id') profileId: string) {
    await this.notificationModel.updateMany(
      { profileId, readAt: null },
      { readAt: new Date() },
    );
  }
}
