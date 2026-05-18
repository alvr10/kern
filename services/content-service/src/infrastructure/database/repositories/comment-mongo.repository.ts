import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../schemas/content-piece.schema';
import { Comment } from '../../../domain/entities/comment.entity';
import { CommentRepository } from '../../../domain/repositories/comment.repository';
import { CommentMapper } from '../mappers/comment.mapper';

@Injectable()
export class CommentMongoRepository implements CommentRepository {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async findById(id: string): Promise<Comment | null> {
    const doc = await this.contentModel.findOne({ 'comments._id': id }).exec();
    if (!doc) return null;
    const comment = doc.comments.find(c => c._id.toString() === id);
    return comment ? CommentMapper.toDomain(comment, doc._id.toString()) : null;
  }

  async findByContentPieceId(contentPieceId: string): Promise<Comment[]> {
    const doc = await this.contentModel.findById(contentPieceId).exec();
    if (!doc) return [];
    return doc.comments.map(c => CommentMapper.toDomain(c, contentPieceId));
  }

  async save(comment: Comment): Promise<void> {
    const data = CommentMapper.toPersistence(comment);
    await this.contentModel
      .findByIdAndUpdate(comment.contentPieceId, {
        $push: { comments: data },
      })
      .exec();
  }

  async update(comment: Comment): Promise<void> {
    const data = CommentMapper.toPersistence(comment);
    await this.contentModel.updateOne({ 'comments._id': data._id }, { $set: { 'comments.$': data } }).exec();
  }
}
