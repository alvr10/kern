import { AIGeneration as MongoGeneration } from '../schemas/ai-generation.schema';
import { AIGeneration } from '../../../domain/entities/ai-generation.entity';
import { AiActionType } from '../../../domain/value-objects/ai-action-type.vo';
import { SocialPlatform } from '../../../domain/value-objects/social-platform.vo';

export class AIGenerationMapper {
  static toDomain(mongo: MongoGeneration): AIGeneration {
    return new AIGeneration(
      (mongo as any)._id.toString(),
      mongo.organizationId,
      mongo.contentPieceId ? mongo.contentPieceId.toString() : null,
      mongo.draftId || null,
      mongo.action as AiActionType,
      mongo.platform as SocialPlatform,
      mongo.prompt,
      mongo.result,
      mongo.tokensTotal,
      mongo.estimatedCostUsd || 0,
      (mongo as any).createdAt,
    );
  }

  static toPersistence(domain: AIGeneration): any {
    return {
      organizationId: domain.organizationId,
      contentPieceId: domain.contentPieceId,
      draftId: domain.draftId,
      action: domain.actionType,
      platform: domain.platform,
      prompt: domain.prompt,
      result: domain.generatedText,
      tokensTotal: domain.tokensUsed,
      tokensInput: Math.floor(domain.tokensUsed * 0.3), // Mock split
      tokensOutput: Math.ceil(domain.tokensUsed * 0.7),
      modelUsed: 'gemini-1.5-flash',
      estimatedCostUsd: domain.estimatedCostUsd,
      profileId: 'dummy', // Schema requires it
    };
  }
}
