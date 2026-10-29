export type CancellationActor = 'player' | 'owner' | 'admin' | 'closure';
export interface CancellationDecision {
  refundPiastres: number;
  retainedPiastres: number;
  commissionPiastres: number;
  reason: 'free_player_cancel' | 'late_player_cancel' | 'operator_cancel';
}

export class CancellationPolicy {
  decide(input: {
    actor: CancellationActor;
    startsAt: Date;
    now: Date;
    paidPiastres: number;
    depositPiastres: number;
  }): CancellationDecision {
    if (input.actor !== 'player') {
      return {
        refundPiastres: input.paidPiastres,
        retainedPiastres: 0,
        commissionPiastres: 0,
        reason: 'operator_cancel',
      };
    }
    const free = input.startsAt.getTime() - input.now.getTime() >= 24 * 60 * 60_000;
    const refundPiastres = free
      ? input.paidPiastres
      : Math.max(0, input.paidPiastres - input.depositPiastres);
    return {
      refundPiastres,
      retainedPiastres: input.paidPiastres - refundPiastres,
      commissionPiastres: 0,
      reason: free ? 'free_player_cancel' : 'late_player_cancel',
    };
  }
}
