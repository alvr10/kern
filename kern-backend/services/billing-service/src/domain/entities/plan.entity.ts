export class Plan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly monthlyTokenLimit: number,
    public readonly memberLimit: number,
    public readonly priceMonthlyUsd: number,
    public readonly features: string[],
    public readonly isActive: boolean,
    public readonly stripePriceIdMonthly: string | null,
  ) {}
}
