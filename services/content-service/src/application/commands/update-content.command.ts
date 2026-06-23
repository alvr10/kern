import { ICommand } from '@nestjs/cqrs';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class UpdateContentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: {
      title?: string;
      body?: string;
      platform?: SocialPlatform;
      hashtags?: string[];
      mediaUrls?: string[];
      scheduledAt?: Date | null;
      kanbanPosition?: number;
    },
  ) {}
}
