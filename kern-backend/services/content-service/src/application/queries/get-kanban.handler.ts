import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetKanbanQuery } from './get-kanban.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece as MongoContentPiece, ContentPieceDocument } from '../../infrastructure/database/schemas/content-piece.schema';
import { ContentStatus } from '../../domain/value-objects/content-status.vo';

@QueryHandler(GetKanbanQuery)
export class GetKanbanHandler implements IQueryHandler<GetKanbanQuery> {
  constructor(
    @InjectModel(MongoContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  async execute(query: GetKanbanQuery): Promise<any> {
    const pieces = await this.contentModel.find({ 
      projectId: query.projectId, 
      deletedAt: null 
    }).sort({ kanbanPosition: 1 }).exec();

    const kanban: Record<string, any[]> = {
      [ContentStatus.DRAFT]: [],
      [ContentStatus.IN_REVIEW]: [],
      [ContentStatus.APPROVED]: [],
      [ContentStatus.PUBLISHED]: [],
      [ContentStatus.ARCHIVED]: [],
    };

    pieces.forEach(p => {
      if (kanban[p.status]) {
        kanban[p.status].push(p);
      }
    });

    return kanban;
  }
}
