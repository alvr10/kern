import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenUsage as MongoUsage } from '../schemas/token-usage.schema';
import { TokenUsage } from '../../../domain/entities/token-usage.entity';
import { TokenUsageRepository } from '../../../domain/repositories/token-usage.repository';
import { TokenUsageMapper } from '../mappers/token-usage.mapper';

@Injectable()
export class TokenUsageMongoRepository implements TokenUsageRepository {
  constructor(
    @InjectModel(MongoUsage.name)
    private readonly usageModel: Model<MongoUsage>,
  ) {}

  async findByOrganizationId(organizationId: string): Promise<TokenUsage | null> {
    const doc = await this.usageModel.findOne({ organizationId }).exec();
    return doc ? TokenUsageMapper.toDomain(doc) : null;
  }

  async save(usage: TokenUsage): Promise<void> {
    const data = TokenUsageMapper.toPersistence(usage);
    await this.usageModel
      .findOneAndUpdate({ organizationId: usage.organizationId }, data, {
        upsert: true,
        returnDocument: 'after',
      })
      .exec();
  }
}
