export type PlayerProfile = {
  userId?: string;
  photoFileId?: string | null;
  photoUrl?: string | null;
  preferredFoot?: string | null;
  playingStyle?: string | null;
  position1?: string | null;
  position2?: string | null;
  padelSide?: string | null;
  padelHand?: string | null;
  padelLevel?: string | null;
  strikes?: number;
  blocked?: boolean;
};

export type Strike = {
  id: string;
  reservationId: string;
  expiresAt: string;
  removedAt: string | null;
  removedReason: string | null;
  createdAt: string;
  venue?: { id: string; name: string };
  reservation?: { id: string; bookingCode: string; startsAt?: string };
};

export type Dispute = {
  id: string;
  reservationId: string;
  playerMessage: string;
  status: 'open' | 'upheld' | 'overturned';
  ownerResponse?: string | null;
  decisionNote?: string | null;
  createdAt: string;
};

export type Appeal = {
  id: string;
  playerId: string;
  message: string;
  status: 'open' | 'rejected' | 'unblocked' | 'strikes_removed';
  createdAt: string;
};
