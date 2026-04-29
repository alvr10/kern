import { OrganizationType } from '../value-objects/organization-type.vo';

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
    public type: OrganizationType,
    public ownerId: string,
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

  public transferOwnership(newOwnerId: string): void {
    if (this.type === OrganizationType.PERSONAL) {
      throw new Error('Ownership of a PERSONAL organization is immutable and tied to the profile.');
    }
    this.ownerId = newOwnerId;
    this.updatedAt = new Date();
  }

  public softDelete(): void {
    if (this.type === OrganizationType.PERSONAL) {
      throw new Error('PERSONAL organizations cannot be deleted as they are permanently tied to your profile.');
    }
    this.deletedAt = new Date();
  }

  public canInvite(): boolean {
    return this.type === OrganizationType.TEAM;
  }
}
