import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListSocialAccountsQuery } from './list-social-accounts.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialAccount as MongoAccount } from '../../infrastructure/database/schemas/social-account.schema';
import { SocialAccountResponseDto } from '../dtos/social-account-response.dto';

@QueryHandler(ListSocialAccountsQuery)
export class ListSocialAccountsHandler implements IQueryHandler<ListSocialAccountsQuery> {
  constructor(
    @InjectModel(MongoAccount.name)
    private readonly accountModel: Model<MongoAccount>,
  ) {}

  async execute(query: ListSocialAccountsQuery): Promise<SocialAccountResponseDto[]> {
    const documents = await this.accountModel.find({ organizationId: query.organizationId }).exec();
    return documents.map(SocialAccountResponseDto.fromPersistence);
  }
}
