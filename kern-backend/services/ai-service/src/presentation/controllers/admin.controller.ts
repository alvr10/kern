import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenUsage } from '../../infrastructure/database/schemas/token-usage.schema';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectModel(TokenUsage.name)
    private readonly usageModel: Model<TokenUsage>,
  ) { }

  @Get('stats')
  async getStats() {
    const usages = await this.usageModel.find().exec();
    const totalTokens = usages.reduce((acc, curr) => acc + curr.tokensUsed, 0);
    return { totalTokens };
  }
}
