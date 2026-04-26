import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerationsController } from './presentation/controllers/generations.controller';
import { HealthController } from './presentation/controllers/health.controller';

import { GenerateContentHandler } from './application/commands/generate-content.handler';
import { RewriteContentHandler } from './application/commands/rewrite-content.handler';
import { GetTokenUsageHandler } from './application/queries/get-token-usage.handler';

import { AI_GENERATION_REPOSITORY } from './domain/repositories/ai-generation.repository';
import { AIGenerationMongoRepository } from './infrastructure/database/repositories/ai-generation-mongo.repository';
import { TOKEN_USAGE_REPOSITORY } from './domain/repositories/token-usage.repository';
import { TokenUsageMongoRepository } from './infrastructure/database/repositories/token-usage-mongo.repository';

import { AIGeneration, AIGenerationSchema } from './infrastructure/database/schemas/ai-generation.schema';
import { TokenUsage, TokenUsageSchema } from './infrastructure/database/schemas/token-usage.schema';
import { GeminiClient } from './infrastructure/external-api/gemini.client';

const Handlers = [
  GenerateContentHandler,
  RewriteContentHandler,
  GetTokenUsageHandler,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: AIGeneration.name, schema: AIGenerationSchema },
      { name: TokenUsage.name, schema: TokenUsageSchema },
    ]),
  ],
  controllers: [GenerationsController, HealthController],
  providers: [
    ...Handlers,
    GeminiClient,
    {
      provide: AI_GENERATION_REPOSITORY,
      useClass: AIGenerationMongoRepository,
    },
    {
      provide: TOKEN_USAGE_REPOSITORY,
      useClass: TokenUsageMongoRepository,
    },
  ],
})
export class AIModule {}
