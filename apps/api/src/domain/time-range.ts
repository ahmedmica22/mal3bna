export class TimeRange {
  private constructor(
    readonly startsAt: Date,
    readonly endsAt: Date,
  ) {
    if (startsAt.getTime() >= endsAt.getTime())
      throw new Error('TimeRange must be half-open and positive');
  }
  static from(startsAt: Date, endsAt: Date): TimeRange {
    return new TimeRange(startsAt, endsAt);
  }
  overlaps(other: TimeRange): boolean {
    return this.startsAt < other.endsAt && other.startsAt < this.endsAt;
  }
}
