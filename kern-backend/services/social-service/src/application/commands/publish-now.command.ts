import { ICommand } from '@nestjs/cqrs';

export class PublishNowCommand implements ICommand {
  constructor(public readonly contentPieceId: string) {}
}
