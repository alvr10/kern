import { ICommand } from '@nestjs/cqrs';

export class SubmitReviewCommand implements ICommand {
  constructor(
    public readonly contentPieceId: string,
    public readonly reviewerId: string,
    public readonly approved: boolean,
    public readonly comment?: string,
  ) {}
}
