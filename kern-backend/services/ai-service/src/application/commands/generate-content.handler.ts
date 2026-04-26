import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateContentCommand } from './generate-content.command';
import { AIGenerationRepository, AI_GENERATION_REPOSITORY } from '../../domain/repositories/ai-generation.repository';
import { TokenUsageRepository, TOKEN_USAGE_REPOSITORY } from '../../domain/repositories/token-usage.repository';
import { GeminiClient } from '../../infrastructure/external-api/gemini.client';
import { AIGeneration } from '../../domain/entities/ai-generation.entity';
import { TokenUsage } from '../../domain/entities/token-usage.entity';
import { AiActionType } from '../../domain/value-objects/ai-action-type.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(GenerateContentCommand)
export class GenerateContentHandler implements ICommandHandler<GenerateContentCommand> {
  constructor(
    @Inject(AI_GENERATION_REPOSITORY)
    private readonly generationRepository: AIGenerationRepository,
    @Inject(TOKEN_USAGE_REPOSITORY)
    private readonly usageRepository: TokenUsageRepository,
    private readonly geminiClient: GeminiClient,
  ) {}

  async execute(command: GenerateContentCommand): Promise<AIGeneration> {
    // 1. Check Usage
    let usage = await this.usageRepository.findByOrganizationId(command.organizationId);
    if (!usage) {
      usage = new TokenUsage(command.organizationId, 0, 50000, null, new Date());
    }

    if (usage.isLimitReached()) {
      throw new Error('Token limit reached for this organization');
    }

    // 2. Prepare Prompt
    const systemPrompt = `You are a social media expert. Create highly engaging posts for ${command.platform}.`;
    let userPrompt = `Topic: ${command.topic}.`;
    if (command.tone) userPrompt += ` Tone: ${command.tone}.`;
    if (command.maxLength) userPrompt += ` Max Length: ${command.maxLength} characters.`;
    userPrompt += ` Only return the text of the post. No explanations, no markdown around it.`;

    // 3. Call Gemini
    const { text, tokensUsed } = await this.geminiClient.generateText(userPrompt, systemPrompt);

    // 4. Update Usage
    usage.addUsage(tokensUsed);
    await this.usageRepository.save(usage);

    // 5. Save Record
    const generation = new AIGeneration(
      uuidv4(),
      command.organizationId,
      command.contentPieceId || null,
      AiActionType.GENERATE,
      command.platform,
      userPrompt,
      text,
      tokensUsed,
      tokensUsed * 0.00002, // Estimated cost
      new Date(),
    );

    await this.generationRepository.save(generation);
    return generation;
  }
}
