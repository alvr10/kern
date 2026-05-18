export class TokenUsage {
  constructor(
    public readonly organizationId: string,
    public tokensUsed: number,
    public tokensLimit: number,
    public readonly resetAt: Date | null,
    public readonly updatedAt: Date,
  ) {}

  public addUsage(tokens: number): void {
    if (this.tokensUsed + tokens > this.tokensLimit) {
      throw new Error('Token limit reached for this organization');
    }
    this.tokensUsed += tokens;
  }

  public isLimitReached(): boolean {
    return this.tokensUsed >= this.tokensLimit;
  }

  public getPercentUsed(): number {
    return (this.tokensUsed / this.tokensLimit) * 100;
  }
}
