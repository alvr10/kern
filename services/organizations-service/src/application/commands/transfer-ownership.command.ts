export class TransferOwnershipCommand {
  constructor(
    public readonly organizationId: string,
    public readonly requesterId: string,
    public readonly newOwnerId: string,
  ) {}
}
