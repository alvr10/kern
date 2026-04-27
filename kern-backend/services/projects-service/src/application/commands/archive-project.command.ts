import { ICommand } from '@nestjs/cqrs';

export class ArchiveProjectCommand implements ICommand {
  constructor(public readonly id: string) {}
}
