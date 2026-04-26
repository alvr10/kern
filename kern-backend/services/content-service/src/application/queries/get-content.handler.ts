import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContentQuery } from './get-content.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../../infrastructure/database/schemas/content-piece.schema';

@QueryHandler(GetContentQuery)
export class GetContentHandler implements IQueryHandler<GetContentQuery> {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async execute(query: GetContentQuery): Promise<any> {
    const doc = await this.contentModel.findById(query.id).exec();
    if (!doc) throw new Error('Content not found');
    return doc;
  }
}
