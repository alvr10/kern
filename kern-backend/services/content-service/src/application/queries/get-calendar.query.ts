export class GetCalendarQuery {
  constructor(
    public readonly projectId: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
