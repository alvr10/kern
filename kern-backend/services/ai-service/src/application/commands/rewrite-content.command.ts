import { ICommand } from '@nestjs/cqrs';

export class RewriteContentCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly contentPieceId: string,
    public readonly originalText: string,
    public readonly instructions?: string | null,
  ) {}
}
