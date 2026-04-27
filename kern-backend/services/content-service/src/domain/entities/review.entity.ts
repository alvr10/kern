export class Review {
  constructor(
    public readonly id: string,
    public readonly contentPieceId: string,
    public readonly reviewerId: string,
    public readonly approved: boolean,
    public readonly comment: string | null,
    public readonly createdAt: Date,
  ) {}
}
