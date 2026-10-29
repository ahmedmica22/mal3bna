export class Money {
  private constructor(readonly piastres: number) {
    if (!Number.isSafeInteger(piastres) || piastres < 0)
      throw new Error('Money must be a non-negative integer in piastres');
  }
  static fromPiastres(piastres: number): Money {
    return new Money(piastres);
  }
  add(other: Money): Money {
    return Money.fromPiastres(this.piastres + other.piastres);
  }
  subtract(other: Money): Money {
    if (other.piastres > this.piastres) throw new Error('Money cannot be negative');
    return Money.fromPiastres(this.piastres - other.piastres);
  }
}
