import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AI_ACTION_TYPE_VALUES, AiActionType, SOCIAL_PLATFORM_VALUES, SocialPlatform } from '@kern/shared';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'ai_generations',
})
export class AIGeneration {
  @Prop({ type: Types.ObjectId, ref: 'ContentPiece', index: true })
  contentPieceId?: Types.ObjectId;

  @Prop({ required: true, index: true })
  profileId: string;

  @Prop({ required: true, index: true })
  organizationId: string;

  @Prop({ type: String, enum: AI_ACTION_TYPE_VALUES, required: true })
  action: AiActionType;

  @Prop({ type: String, enum: SOCIAL_PLATFORM_VALUES })
  platform?: SocialPlatform;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  tokensInput: number;

  @Prop({ required: true })
  tokensOutput: number;

  @Prop({ required: true })
  tokensTotal: number;

  @Prop({ required: true })
  modelUsed: string;

  @Prop()
  estimatedCostUsd?: number;
}

export type AIGenerationDocument = AIGeneration & Document;
export const AIGenerationSchema = SchemaFactory.createForClass(AIGeneration);

AIGenerationSchema.index({ organizationId: 1, createdAt: -1 });
