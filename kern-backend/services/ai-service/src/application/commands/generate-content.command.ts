import { ICommand } from '@nestjs/cqrs';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class GenerateContentCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly platform: SocialPlatform,
    public readonly topic: string,
    public readonly contentPieceId?: string | null,
    public readonly tone?: string | null,
    public readonly maxLength?: number | null,
  ) {}
}
