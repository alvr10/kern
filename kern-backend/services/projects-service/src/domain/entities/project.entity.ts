export class Project {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public name: string,
    public description: string | null,
    public color: string | null,
    public isArchived: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public update(name?: string, description?: string | null, color?: string | null): void {
    if (name) this.name = name;
    if (description !== undefined) this.description = description;
    if (color !== undefined) this.color = color;
    this.updatedAt = new Date();
  }

  public archive(): void {
    this.isArchived = true;
    this.updatedAt = new Date();
  }
}
