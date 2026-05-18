import { ContentStatus } from '../../domain/value-objects/content-status.vo';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class ListContentQuery {
  constructor(
    public readonly organizationId: string,
    public readonly status?: ContentStatus,
    public readonly platform?: SocialPlatform,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
