import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIGeneration as MongoGeneration, AIGenerationDocument } from '../schemas/ai-generation.schema';
import { AIGeneration } from '../../../domain/entities/ai-generation.entity';
import { AIGenerationRepository } from '../../../domain/repositories/ai-generation.repository';
import { AIGenerationMapper } from '../mappers/ai-generation.mapper';

@Injectable()
export class AIGenerationMongoRepository implements AIGenerationRepository {
  constructor(
    @InjectModel(MongoGeneration.name)
    private readonly generationModel: Model<AIGenerationDocument>,
  ) {}

  async findById(id: string): Promise<AIGeneration | null> {
    const doc = await this.generationModel.findById(id).exec();
    return doc ? AIGenerationMapper.toDomain(doc) : null;
  }

  async findByOrganizationId(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ data: AIGeneration[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.generationModel.find({ organizationId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.generationModel.countDocuments({ organizationId }).exec(),
    ]);

    return {
      data: docs.map(AIGenerationMapper.toDomain),
      total,
    };
  }

  async save(generation: AIGeneration): Promise<void> {
    const data = AIGenerationMapper.toPersistence(generation);
    const created = new this.generationModel(data);
    await created.save();
  }
}
