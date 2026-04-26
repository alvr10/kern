import { AIGeneration } from '../entities/ai-generation.entity';

export const AI_GENERATION_REPOSITORY = Symbol('AI_GENERATION_REPOSITORY');

export interface AIGenerationRepository {
  findById(id: string): Promise<AIGeneration | null>;
  findByOrganizationId(organizationId: string, page: number, limit: number): Promise<{ data: AIGeneration[], total: number }>;
  save(generation: AIGeneration): Promise<void>;
}
