import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialAccount, SocialAccountSchema } from './schemas/social-account.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
    MongooseModule.forFeature([{ name: SocialAccount.name, schema: SocialAccountSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
