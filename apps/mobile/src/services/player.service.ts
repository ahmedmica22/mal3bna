import { request } from './api';

export interface PlayerProfileData {
  userId?: string;
  photoFileId?: string | null;
  photoUrl?: string | null;
  preferredFoot?: string | null;
  playingStyle?: string | null;
  position1?: string | null;
  position2?: string | null;
  areaId?: string | null;
  padelSide?: string | null;
  padelHand?: string | null;
  padelLevel?: string | null;
}

export const playerService = {
  async getProfile(token: string | null): Promise<PlayerProfileData | null> {
    if (!token) return null;
    try {
      return await request<PlayerProfileData>('/player/profile', {}, token);
    } catch {
      return null;
    }
  },

  async updateProfile(
    token: string | null,
    data: {
      preferredFoot?: string;
      playingStyle?: string;
      position1?: string;
      padelLevel?: string;
      photoUrl?: string;
    },
  ): Promise<PlayerProfileData> {
    if (!token) throw new Error('Authentication required');
    return await request<PlayerProfileData>(
      '/player/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token,
    );
  },
};
