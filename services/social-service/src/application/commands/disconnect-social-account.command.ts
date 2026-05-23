import { ICommand } from '@nestjs/cqrs';

export class DisconnectSocialAccountCommand implements ICommand {
  constructor(public readonly id: string) {}
}
