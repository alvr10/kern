import { ICommand } from '@nestjs/cqrs';
import { ContentStatus } from '../../domain/value-objects/content-status.vo';

export class UpdateContentStatusCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly status: ContentStatus,
  ) {}
}
