import { AiActionType } from '../value-objects/ai-action-type.vo';
import { SocialPlatform } from '../value-objects/social-platform.vo';

export class AIGeneration {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly contentPieceId: string | null,
    public readonly draftId: string | null,
    public readonly actionType: AiActionType,
    public readonly platform: SocialPlatform,
    public readonly prompt: string,
    public readonly generatedText: string,
    public readonly tokensUsed: number,
    public readonly estimatedCostUsd: number,
    public readonly createdAt: Date,
  ) {}
}
