export class MarkAllNotificationsAsReadCommand {
  constructor(
    public readonly userId: string,
    public readonly userEmail?: string,
  ) {}
}
