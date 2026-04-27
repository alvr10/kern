import { ICommand } from '@nestjs/cqrs';

export class AddCommentCommand implements ICommand {
  constructor(
    public readonly contentPieceId: string,
    public readonly authorId: string,
    public readonly body: string,
    public readonly parentId?: string,
  ) {}
}
