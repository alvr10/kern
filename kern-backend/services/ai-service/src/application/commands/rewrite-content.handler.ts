import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RewriteContentCommand } from './rewrite-content.command';
import { AIGenerationRepository, AI_GENERATION_REPOSITORY } from '../../domain/repositories/ai-generation.repository';
import { TokenUsageRepository, TOKEN_USAGE_REPOSITORY } from '../../domain/repositories/token-usage.repository';
import { GeminiClient } from '../../infrastructure/external-api/gemini.client';
import { AIGeneration } from '../../domain/entities/ai-generation.entity';
import { TokenUsage } from '../../domain/entities/token-usage.entity';
import { AiActionType } from '../../domain/value-objects/ai-action-type.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

@CommandHandler(RewriteContentCommand)
export class RewriteContentHandler implements ICommandHandler<RewriteContentCommand> {
  constructor(
    @Inject(AI_GENERATION_REPOSITORY)
    private readonly generationRepository: AIGenerationRepository,
    @Inject(TOKEN_USAGE_REPOSITORY)
    private readonly usageRepository: TokenUsageRepository,
    private readonly geminiClient: GeminiClient,
  ) {}

  async execute(command: RewriteContentCommand): Promise<AIGeneration> {
    let usage = await this.usageRepository.findByOrganizationId(command.organizationId);
    if (!usage) usage = new TokenUsage(command.organizationId, 0, 50000, null, new Date());
    if (usage.isLimitReached()) throw new Error('Token limit reached');

    const systemPrompt = `You are an editor. Rewrite the following content according to instructions.`;
    let userPrompt = `Original Text: ${command.originalText}.`;
    if (command.instructions) userPrompt += ` Instructions: ${command.instructions}.`;
    userPrompt += ` Return ONLY the rewritten text.`;

    const { text, tokensUsed } = await this.geminiClient.generateText(userPrompt, systemPrompt);

    usage.addUsage(tokensUsed);
    await this.usageRepository.save(usage);

    const generation = new AIGeneration(
      uuidv4(),
      command.organizationId,
      command.contentPieceId,
      AiActionType.REWRITE,
      SocialPlatform.TWITTER, // Dummy platform for rewrite
      userPrompt,
      text,
      tokensUsed,
      tokensUsed * 0.00002,
      new Date(),
    );

    await this.generationRepository.save(generation);
    return generation;
  }
}
