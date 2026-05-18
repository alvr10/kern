import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentPiece, ContentPieceDocument } from '../schemas/content-piece.schema';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectModel(ContentPiece.name)
    private readonly contentModel: Model<ContentPieceDocument>,
  ) {}

  @Get('stats')
  async getStats() {
    const totalContent = await this.contentModel.countDocuments().exec();
    return totalContent; // Returning direct number as requested by handler
  }
}
