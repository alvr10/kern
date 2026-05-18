import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'token_usage' })
export class TokenUsage extends Document {
  @Prop({ required: true, unique: true, index: true })
  organizationId: string;

  @Prop({ required: true, default: 0 })
  tokensUsed: number;

  @Prop({ required: true, default: 50000 })
  tokensLimit: number;

  @Prop()
  resetAt?: Date;
}

export const TokenUsageSchema = SchemaFactory.createForClass(TokenUsage);
