import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCommentsQuery } from './list-comments.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../../infrastructure/database/schemas/content-piece.schema';

@QueryHandler(ListCommentsQuery)
export class ListCommentsHandler implements IQueryHandler<ListCommentsQuery> {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async execute(query: ListCommentsQuery): Promise<any[]> {
    const doc = await this.contentModel.findById(query.contentPieceId).exec();
    if (!doc) return [];
    return doc.comments;
  }
}
