export interface BrandVoice {
  tone?: string;
  style?: string;
  keywords?: string[];
  avoidWords?: string[];
}

export class Organization {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public logoUrl: string | null,
    public brandVoice: BrandVoice | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null = null,
  ) {}

  public update(name?: string, logoUrl?: string | null, brandVoice?: BrandVoice | null): void {
    if (name) this.name = name;
    if (logoUrl !== undefined) this.logoUrl = logoUrl;
    if (brandVoice !== undefined) this.brandVoice = brandVoice;
    this.updatedAt = new Date();
  }

  public softDelete(): void {
    this.deletedAt = new Date();
  }
}
