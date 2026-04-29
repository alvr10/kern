import { ICommand } from '@nestjs/cqrs';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class CreateContentCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly authorId: string,
    public readonly draftId: string | null,
    public readonly title: string,
    public readonly body: string,
    public readonly platform: SocialPlatform,
    public readonly hashtags?: string[],
    public readonly mediaUrls?: string[],
    public readonly scheduledAt?: Date,
  ) {}
}
