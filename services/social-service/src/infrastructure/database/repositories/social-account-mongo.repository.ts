import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialAccount as MongoAccount } from '../schemas/social-account.schema';
import { SocialAccount } from '../../../domain/entities/social-account.entity';
import { SocialAccountRepository } from '../../../domain/repositories/social-account.repository';
import { SocialAccountMapper } from '../mappers/social-account.mapper';
import { SocialPlatform } from '../../../domain/value-objects/social-platform.vo';

@Injectable()
export class SocialAccountMongoRepository implements SocialAccountRepository {
  constructor(
    @InjectModel(MongoAccount.name)
    private readonly accountModel: Model<MongoAccount>,
  ) {}

  async findById(id: string): Promise<SocialAccount | null> {
    const doc = await this.accountModel.findById(id).exec();
    return doc ? SocialAccountMapper.toDomain(doc) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<SocialAccount[]> {
    const docs = await this.accountModel.find({ organizationId }).exec();
    return docs.map(SocialAccountMapper.toDomain);
  }

  async findByPlatform(organizationId: string, platform: SocialPlatform): Promise<SocialAccount | null> {
    const doc = await this.accountModel.findOne({ organizationId, platform }).exec();
    return doc ? SocialAccountMapper.toDomain(doc) : null;
  }

  async save(account: SocialAccount): Promise<void> {
    const data = SocialAccountMapper.toPersistence(account);
    if (account.id && account.id.length === 24) {
      // Basic check for ObjectID string
      await this.accountModel.findByIdAndUpdate(account.id, data, { upsert: true }).exec();
    } else {
      const created = new this.accountModel(data);
      const saved = await created.save();
      account.id = saved._id.toString();
    }
  }

  async delete(id: string): Promise<void> {
    await this.accountModel.findByIdAndDelete(id).exec();
  }
}
