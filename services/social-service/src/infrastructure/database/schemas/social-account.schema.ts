import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SOCIAL_PLATFORM_VALUES, SocialPlatform } from '@kern/core-backend';

@Schema({ timestamps: true, collection: 'social_accounts' })
export class SocialAccount extends Document {
  @Prop({ required: true, index: true })
  organizationId: string;

  @Prop({ type: String, enum: SOCIAL_PLATFORM_VALUES, required: true })
  platform: SocialPlatform;

  @Prop({ required: true })
  platformUserId: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  expiresAt?: Date;

  @Prop({ type: Object })
  profileData: Record<string, any>;
}

export const SocialAccountSchema = SchemaFactory.createForClass(SocialAccount);
SocialAccountSchema.index({ organizationId: 1, platform: 1 }, { unique: true });
