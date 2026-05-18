import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIGeneration, AIGenerationSchema } from './schemas/ai-generation.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
    MongooseModule.forFeature([{ name: AIGeneration.name, schema: AIGenerationSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
