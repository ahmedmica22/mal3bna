import React, { useState, useEffect } from 'react';
import { playerService } from '../../../services/player.service';
import { accountService } from '../../../services/account.service';
import { errorMessage } from '../../../utils/errors';
import type { ShowToastFn } from '../../../hooks/useToast';

interface UsePlayerProfileOptions {
  token: string | null;
  userRole?: string | undefined;
  accountToken: React.MutableRefObject<string | null>;
  showToast: ShowToastFn;
}

export function usePlayerProfile({
  token,
  userRole,
  accountToken,
  showToast,
}: UsePlayerProfileOptions) {
  const [preferredFoot, setPreferredFoot] = useState('Right');
  const [playingStyle, setPlayingStyle] = useState('Playmaker');
  const [padelLevel, setPadelLevel] = useState('Intermediate (3.5)');
  const [playerPhotoUrl, setPlayerPhotoUrl] = useState<string | null>(null);
  const [activeStrikesCount, setActiveStrikesCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setPlayerPhotoUrl(null);
      setActiveStrikesCount(0);
    }
  }, [token]);

  useEffect(() => {
    if (token && userRole === 'player') {
      playerService
        .getProfile(token)
        .then((profile) => {
          if (profile && accountToken.current === token) {
            if (profile.preferredFoot) setPreferredFoot(profile.preferredFoot);
            if (profile.playingStyle) setPlayingStyle(profile.playingStyle);
            if (profile.padelLevel) setPadelLevel(profile.padelLevel);
            if (profile.photoUrl) setPlayerPhotoUrl(profile.photoUrl);
          }
        })
        .catch((error) => {
          if (accountToken.current === token) {
            showToast('error', 'Profile', errorMessage(error, 'Could not load profile.'));
          }
        });

      accountService
        .strikes()
        .then((strikes) => {
          if (Array.isArray(strikes)) {
            const active = strikes.filter(
              (s) => new Date(s.expiresAt) > new Date() && !s.removedAt,
            );
            setActiveStrikesCount(active.length);
          }
        })
        .catch(() => {});
    }
  }, [token, userRole, accountToken, showToast]);

  async function savePlayerPreferences(patch: {
    preferredFoot?: string;
    playingStyle?: string;
    padelLevel?: string;
  }) {
    if (!token) return;
    try {
      await playerService.updateProfile(token, patch);
      if (patch.preferredFoot) setPreferredFoot(patch.preferredFoot);
      if (patch.playingStyle) setPlayingStyle(patch.playingStyle);
      if (patch.padelLevel) setPadelLevel(patch.padelLevel);
    } catch (error) {
      showToast('error', 'Profile', errorMessage(error, 'Could not save profile preferences.'));
    }
  }

  async function handlePlayerPhotoUploaded(dataUrl: string) {
    if (!token) return;
    setPlayerPhotoUrl(dataUrl);
    try {
      await playerService.updateProfile(token, {
        preferredFoot,
        playingStyle,
        padelLevel,
        photoUrl: dataUrl,
      });
      showToast(
        'success',
        'Profile Photo Saved',
        'Your avatar has been uploaded and saved to your profile.',
      );
    } catch {
      showToast('error', 'Upload Failed', 'Could not save profile photo to server.');
    }
  }

  return {
    preferredFoot,
    setPreferredFoot,
    playingStyle,
    setPlayingStyle,
    padelLevel,
    setPadelLevel,
    playerPhotoUrl,
    setPlayerPhotoUrl,
    savePlayerPreferences,
    handlePlayerPhotoUploaded,
    activeStrikesCount,
  };
}
