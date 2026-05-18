import { Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PublishNowCommand } from '../../application/commands/publish-now.command';

@Controller('social/publish')
export class PublishingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':contentPieceId')
  async publish(@Param('contentPieceId') contentPieceId: string) {
    return this.commandBus.execute(new PublishNowCommand(contentPieceId));
  }
}
