import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../schemas/content-piece.schema';
import { ContentPiece } from '../../../domain/entities/content-piece.entity';
import { Review } from '../../../domain/entities/review.entity';
import { ContentRepository } from '../../../domain/repositories/content.repository';
import { ContentMapper } from '../mappers/content.mapper';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class ContentMongoRepository implements ContentRepository {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async findById(id: string): Promise<ContentPiece | null> {
    const doc = await this.contentModel.findById(id).exec();
    return doc ? ContentMapper.toDomain(doc) : null;
  }

  async save(contentPiece: ContentPiece): Promise<void> {
    const data = ContentMapper.toPersistence(contentPiece);
    const created = new this.contentModel(data);
    await created.save();
  }

  async update(contentPiece: ContentPiece): Promise<void> {
    const data = ContentMapper.toPersistence(contentPiece);
    await this.contentModel.findByIdAndUpdate(contentPiece.id, data).exec();
  }

  async addReview(review: Review): Promise<void> {
    const data = ReviewMapper.toPersistence(review);
    await this.contentModel.findByIdAndUpdate(review.contentPieceId, {
      $push: { reviews: data },
    }).exec();
  }
}
