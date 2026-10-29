export interface StrikeDecision {
  activeStrikes: number;
  warning: boolean;
  blocked: boolean;
}

export class StrikePolicy {
  evaluate(activeStrikes: number): StrikeDecision {
    const normalized = Math.max(0, Math.floor(activeStrikes));
    return {
      activeStrikes: normalized,
      warning: normalized === 2 || normalized === 3,
      blocked: normalized >= 4,
    };
  }

  expiryDate(createdAt: Date): Date {
    const expiry = new Date(createdAt);
    expiry.setUTCMonth(expiry.getUTCMonth() + 6);
    return expiry;
  }
}
