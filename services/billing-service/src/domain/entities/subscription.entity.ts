export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public planId: string,
    public status: SubscriptionStatus,
    public tokensUsed: number,
    public tokensLimit: number,
    public stripeCustomerId: string | null,
    public stripeSubscriptionId: string | null,
    public stripeCurrentPeriodEnd: Date | null,
    public stripeCancelAtPeriodEnd: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public changePlan(planId: string, tokensLimit: number): void {
    this.planId = planId;
    this.tokensLimit = tokensLimit;
  }

  public activate(stripeSubscriptionId: string, stripeCustomerId: string, periodEnd: Date): void {
    this.status = SubscriptionStatus.ACTIVE;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.stripeCustomerId = stripeCustomerId;
    this.stripeCurrentPeriodEnd = periodEnd;
  }

  public cancel(): void {
    this.stripeCancelAtPeriodEnd = true;
  }

  public addUsage(amount: number): void {
    this.tokensUsed += amount;
  }

  public isLimitReached(): boolean {
    return this.tokensUsed >= this.tokensLimit;
  }
}
