export class DeductTokensCommand {
  constructor(
    public readonly organizationId: string,
    public readonly tokens: number,
  ) {}
}
