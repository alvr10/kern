export class ListProjectsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly archived: boolean = false,
  ) {}
}
