import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOKEN_USAGE_REPOSITORY, TokenUsageRepository } from '../../domain/repositories/token-usage.repository';
import { TokenUsage } from '../../domain/entities/token-usage.entity';

@Controller()
export class BillingEventsConsumer {
  constructor(
    @Inject(TOKEN_USAGE_REPOSITORY)
    private readonly tokenUsageRepository: TokenUsageRepository,
  ) {}

  @EventPattern('billing.usage_updated')
  async handleUsageUpdated(@Payload() data: { organizationId: string; tokensUsed: number; tokensLimit: number }) {
    console.log(
      `[ai-service] 🔄 Syncing token balance for org ${data.organizationId}: ${data.tokensUsed}/${data.tokensLimit}`,
    );

    let usage = await this.tokenUsageRepository.findByOrganizationId(data.organizationId);

    if (!usage) {
      usage = new TokenUsage(data.organizationId, data.tokensUsed, data.tokensLimit, null, new Date());
    } else {
      // Direct overwrite from source of truth
      (usage as any).tokensUsed = data.tokensUsed;
      (usage as any).tokensLimit = data.tokensLimit;
      (usage as any).updatedAt = new Date();
    }

    await this.tokenUsageRepository.save(usage);
  }
}
