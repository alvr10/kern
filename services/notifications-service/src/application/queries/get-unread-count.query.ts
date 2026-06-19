export class GetUnreadCountQuery {
  constructor(
    public readonly userId: string,
    public readonly userEmail?: string,
  ) {}
}
