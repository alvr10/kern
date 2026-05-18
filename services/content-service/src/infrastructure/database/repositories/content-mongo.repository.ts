import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    let doc = await this.contentModel.findById(id).exec();

    // Fallback for older documents stored as ObjectId
    if (!doc && Types.ObjectId.isValid(id)) {
      doc = await this.contentModel.findById(new Types.ObjectId(id)).exec();
    }

    return doc ? ContentMapper.toDomain(doc) : null;
  }

  async save(contentPiece: ContentPiece): Promise<void> {
    const data = ContentMapper.toPersistence(contentPiece);
    const created = new this.contentModel(data);
    await created.save();
  }

  async update(contentPiece: ContentPiece): Promise<void> {
    const data = ContentMapper.toPersistence(contentPiece);
    const id = contentPiece.id;

    const result = await this.contentModel.findByIdAndUpdate(id, data).exec();

    // Fallback for older documents stored as ObjectId
    if (!result && Types.ObjectId.isValid(id)) {
      await this.contentModel.findByIdAndUpdate(new Types.ObjectId(id), data).exec();
    }
  }

  async addReview(review: Review): Promise<void> {
    const data = ReviewMapper.toPersistence(review);
    const id = review.contentPieceId;

    const result = await this.contentModel
      .findByIdAndUpdate(id, {
        $push: { reviews: data },
      })
      .exec();

    // Fallback for older documents stored as ObjectId
    if (!result && Types.ObjectId.isValid(id)) {
      await this.contentModel
        .findByIdAndUpdate(new Types.ObjectId(id), {
          $push: { reviews: data },
        })
        .exec();
    }
  }
}
