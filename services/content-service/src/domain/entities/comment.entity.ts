export class Comment {
  constructor(
    public readonly id: string,
    public readonly contentPieceId: string,
    public readonly authorId: string,
    public body: string,
    public readonly parentId: string | null,
    public resolvedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  public resolve(): void {
    this.resolvedAt = new Date();
  }
}
