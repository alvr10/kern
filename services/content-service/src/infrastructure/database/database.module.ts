import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentPiece, ContentPieceSchema } from './schemas/content-piece.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
    MongooseModule.forFeature([{ name: ContentPiece.name, schema: ContentPieceSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
