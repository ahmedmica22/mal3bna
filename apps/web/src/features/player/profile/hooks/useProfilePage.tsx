import { useLanguage } from '../../../../store/LanguageStore';
import { useAuth } from '../../../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { trustApi, authApi, bookingApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';

const footOptions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'both', label: 'Both / Ambidextrous' },
];
const styleOptions = [
  { value: 'Playmaker', label: 'Playmaker' },
  { value: 'Poacher / Striker', label: 'Poacher / Striker' },
  { value: 'Winger / Speedster', label: 'Winger / Speedster' },
  { value: 'Box-to-box Engine', label: 'Box-to-box Engine' },
  { value: 'Ball-playing Defender', label: 'Ball-playing Defender' },
  { value: 'Goalkeeper', label: 'Goalkeeper' },
];
const padelOptions = [
  { value: 'beginner', label: 'Beginner (1.0 - 2.5)' },
  { value: 'intermediate', label: 'Intermediate (3.0 - 4.5)' },
  { value: 'advanced', label: 'Advanced (5.0+)' },
];
export function useProfilePage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [preferredFoot, setPreferredFoot] = useState('right');
  const [playingStyle, setPlayingStyle] = useState('Playmaker');
  const [position1, setPosition1] = useState('Center Midfield');
  const [padelLevel, setPadelLevel] = useState('intermediate');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete account state
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Appeal state
  const [appealMessage, setAppealMessage] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

  // Editable personal info state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const isSavingRef = useRef(false);
  const isSavingInfoRef = useRef(false);

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
  });

  const bookingsQuery = useQuery({
    queryKey: ['player-bookings'],
    queryFn: () => bookingApi.list(),
  });

  const activeBookingsCount = (bookingsQuery.data ?? []).filter((b) => {
    if (b.status === 'cancelled' || b.status === 'completed' || b.status === 'expired') return false;
    const matchEndTime = new Date(b.endsAt).getTime();
    return matchEndTime > Date.now() || b.status === 'confirmed' || b.status === 'held' || b.status === 'arrived';
  }).length;
  const hasActiveBookings = activeBookingsCount > 0;

  useEffect(() => {
    if (meQuery.data) {
      setName(meQuery.data.name ?? '');
      setPhone(meQuery.data.phone ?? '');
    }
  }, [meQuery.data]);

  async function handleSaveAccountInfo(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim() || isSavingInfo || isSavingInfoRef.current) return;
    isSavingInfoRef.current = true;
    setIsSavingInfo(true);
    try {
      await authApi.updateProfile({
        name: name.trim(),
        phone: phone.trim() || null,
      });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsEditingInfo(false);
      toast.success(
        translate('Your personal information has been updated.'),
        translate('Profile Updated'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not update profile',
        translate('Save Error'),
      );
    } finally {
      setIsSavingInfo(false);
      isSavingInfoRef.current = false;
    }
  }

  const profileQuery = useQuery({
    queryKey: ['player-profile'],
    queryFn: () => trustApi.profile(),
  });

  const strikesQuery = useQuery({
    queryKey: ['player-strikes'],
    queryFn: () => trustApi.strikes(),
  });

  useEffect(() => {
    if (profileQuery.data) {
      if (profileQuery.data.preferredFoot) setPreferredFoot(profileQuery.data.preferredFoot);
      if (profileQuery.data.playingStyle) setPlayingStyle(profileQuery.data.playingStyle);
      if (profileQuery.data.position1) setPosition1(profileQuery.data.position1);
      if (profileQuery.data.padelLevel) setPadelLevel(profileQuery.data.padelLevel);
      if (profileQuery.data.photoUrl) setPhotoUrl(profileQuery.data.photoUrl);
    }
  }, [profileQuery.data]);

  const activeStrikes = (strikesQuery.data ?? []).filter(
    (s) => new Date(s.expiresAt) > new Date() && !s.removedAt,
  );
  const isBlocked = activeStrikes.length >= 4 || meQuery.data?.status === 'blocked';

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setPhotoUrl(dataUrl);
        try {
          await trustApi.updateProfile({
            preferredFoot,
            playingStyle,
            position1,
            padelLevel,
            photoUrl: dataUrl,
          });
          await queryClient.invalidateQueries({ queryKey: ['player-profile'] });
          toast.success(
            translate('Your profile photo has been uploaded and saved.'),
            translate('Photo Saved'),
          );
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : 'Failed to save photo',
            translate('Save Error'),
          );
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.onerror = () => {
        setIsUploadingPhoto(false);
        toast.error(translate('Failed to read image file.'), translate('Upload Error'));
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingPhoto(false);
      toast.error(translate('Could not process photo selection.'), translate('Upload Error'));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (isSaving || isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await trustApi.updateProfile({
        preferredFoot,
        playingStyle,
        position1,
        padelLevel,
        ...(photoUrl ? { photoUrl } : {}),
      });
      await queryClient.invalidateQueries({ queryKey: ['player-profile'] });
      setSaveSuccess(true);
      toast.success(
        translate('Your player attributes and positions have been saved.'),
        translate('Profile Updated'),
      );
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not save profile',
        translate('Save Error'),
      );
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  }

  async function handleAppeal(e: React.FormEvent) {
    e.preventDefault();
    if (!appealMessage.trim()) return;
    setIsSubmittingAppeal(true);
    try {
      await trustApi.createAppeal(appealMessage);
      setAppealSubmitted(true);
      setAppealMessage('');
      toast.info(
        translate('Your appeal has been submitted to admin oversight.'),
        translate('Appeal Filed'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Appeal submission failed',
        translate('Appeal Error'),
      );
    } finally {
      setIsSubmittingAppeal(false);
    }
  }

  async function handleDeleteAccount() {
    if (hasActiveBookings) {
      toast.error(
        translate('You cannot delete your account as long as you have appointments booked. Please attend or cancel your reservations first.'),
        translate('Account Deletion Blocked'),
      );
      setShowDeleteModal(false);
      return;
    }
    setIsDeletingAccount(true);
    try {
      await authApi.deleteAccount();
      toast.success(
        translate('Your account has been deleted permanently.'),
        translate('Account Deleted'),
      );
      await signOut();
      navigate('/login');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : translate('Action Failed'),
        translate('Account Deletion Blocked'),
      );
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  }

  if (meQuery.isLoading || profileQuery.isLoading)
    return { view: 'Loading', props: { translate } } as const;

  const user = meQuery.data;

  return {
    view: 'Content',
    props: {
      activeStrikes,
      appealMessage,
      appealSubmitted,
      footOptions,
      handleAppeal,
      handleDeleteAccount,
      handlePhotoUpload,
      handleSave,
      isBlocked,
      isDeletingAccount,
      isSaving,
      isSubmittingAppeal,
      isUploadingPhoto,
      padelLevel,
      padelOptions,
      photoUrl,
      playingStyle,
      position1,
      preferredFoot,
      saveSuccess,
      setAppealMessage,
      setPadelLevel,
      setPlayingStyle,
      setPosition1,
      setPreferredFoot,
      setShowDeleteModal,
      showDeleteModal,
      styleOptions,
      translate,
      user,
      name,
      setName,
      phone,
      setPhone,
      isEditingInfo,
      setIsEditingInfo,
      isSavingInfo,
      handleSaveAccountInfo,
      hasActiveBookings,
      activeBookingsCount,
    },
  } as const;
}
