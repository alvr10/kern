import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalendarQuery } from './get-calendar.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContentPiece as MongoContentPiece,
  ContentPieceDocument,
} from '../../infrastructure/database/schemas/content-piece.schema';

@QueryHandler(GetCalendarQuery)
export class GetCalendarHandler implements IQueryHandler<GetCalendarQuery> {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async execute(query: GetCalendarQuery): Promise<any[]> {
    return this.contentModel
      .find({
        projectId: query.projectId,
        scheduledAt: {
          $gte: query.from,
          $lte: query.to,
        },
        deletedAt: null,
      })
      .sort({ scheduledAt: 1 })
      .exec();
  }
}
