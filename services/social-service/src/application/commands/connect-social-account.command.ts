import { ICommand } from '@nestjs/cqrs';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';

export class ConnectSocialAccountCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly platform: SocialPlatform,
    public readonly platformUserId: string,
    public readonly accessToken: string,
    public readonly refreshToken?: string,
    public readonly expiresAt?: Date,
  ) {}
}
