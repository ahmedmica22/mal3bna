export class NoShowPolicy {
  canReport(startsAt: Date, endsAt: Date, now: Date): boolean {
    return (
      now.getTime() >= startsAt.getTime() + 15 * 60_000 &&
      now.getTime() <= endsAt.getTime() + 24 * 60 * 60_000
    );
  }
  disputeDeadline(reportedAt: Date): Date {
    return new Date(reportedAt.getTime() + 48 * 60 * 60_000);
  }
}
