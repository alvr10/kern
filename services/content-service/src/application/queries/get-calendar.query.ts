export class GetCalendarQuery {
  constructor(
    public readonly organizationId: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
