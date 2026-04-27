import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListContentQuery } from './list-content.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContentPiece as MongoContentPiece,
  ContentPieceDocument,
} from '../../infrastructure/database/schemas/content-piece.schema';

@QueryHandler(ListContentQuery)
export class ListContentHandler implements IQueryHandler<ListContentQuery> {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async execute(query: ListContentQuery): Promise<any> {
    const filter: any = { projectId: query.projectId, deletedAt: null };
    if (query.status) filter.status = query.status;
    if (query.platform) filter.platform = query.platform;

    const skip = (query.page - 1) * query.limit;

    const [data, total] = await Promise.all([
      this.contentModel.find(filter).skip(skip).limit(query.limit).sort({ createdAt: -1 }).exec(),
      this.contentModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
