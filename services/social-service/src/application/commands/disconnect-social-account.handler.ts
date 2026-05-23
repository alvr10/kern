import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DisconnectSocialAccountCommand } from './disconnect-social-account.command';
import {
  SocialAccountRepository,
  SOCIAL_ACCOUNT_REPOSITORY,
} from '../../domain/repositories/social-account.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(DisconnectSocialAccountCommand)
export class DisconnectSocialAccountHandler implements ICommandHandler<DisconnectSocialAccountCommand> {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly accountRepository: SocialAccountRepository,
  ) {}

  async execute(command: DisconnectSocialAccountCommand): Promise<void> {
    await this.accountRepository.delete(command.id);
  }
}
