import { ICommand } from '@nestjs/cqrs';

export class UpdateContentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: {
      title?: string;
      body?: string;
      hashtags?: string[];
      mediaUrls?: string[];
      scheduledAt?: Date | null;
      kanbanPosition?: number;
    },
  ) {}
}
