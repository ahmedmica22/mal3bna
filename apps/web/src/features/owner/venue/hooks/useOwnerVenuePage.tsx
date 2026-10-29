import { useVenueOnboarding } from './useVenueOnboarding';
import { useOwnerCourtManagement } from './useOwnerCourtManagement';
import { useOwnerVenueEdit } from './useOwnerVenueEdit';
import { photoUrls } from '../../../../utils/photos';
import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, ownerApi, request } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { useActionDialog } from '../../../../components/feedback/ActionDialogProvider';

export function useOwnerVenuePage() {
  const {
    newVenueName,
    setNewVenueName,
    newAreaId,
    setNewAreaId,
    newAddress,
    setNewAddress,
    newPhone,
    setNewPhone,
    newDescription,
    setNewDescription,
    newMaxHours,
    setNewMaxHours,
    venuePhotos,
    setVenuePhotos,
    initialCourtName,
    setInitialCourtName,
    initialSport,
    setInitialSport,
    initialSize,
    setInitialSize,
    initialSurface,
    setInitialSurface,
    initialIsIndoor,
    setInitialIsIndoor,
    initialHourlyRate,
    setInitialHourlyRate,
    isSubmittingVenue,
    handleRegisterVenue,
    removeOnboardingPhoto,
  } = useVenueOnboarding();
  const { translate } = useLanguage();
  const { toast } = useToast();
  const ask = useActionDialog();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
  });

  const venueQuery = useQuery({
    queryKey: ['owner-venue'],
    queryFn: () => ownerApi.mine(),
  });

  const areasQuery = useQuery({
    queryKey: ['public-areas'],
    queryFn: () => request<Array<{ id: string; nameEn: string; nameAr: string }>>('/public/areas'),
  });

  const user = meQuery.data;
  const venue = venueQuery.data;
  const areas = areasQuery.data ?? [];

  const courtMgmt = useOwnerCourtManagement({
    venueId: venue?.id,
    queryClient,
    toast,
    translate,
  });

  const venueEdit = useOwnerVenueEdit({
    venueId: venue?.id,
    queryClient,
    toast,
    translate,
  });

  // Manage photos modal state (for existing venue)
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [editPhotosList, setEditPhotosList] = useState<string[]>([]);
  const [isSubmittingPhotos, setIsSubmittingPhotos] = useState(false);

  // Price rule form state
  const [pricingCourtId, setPricingCourtId] = useState('');
  const [priceEgp, setPriceEgp] = useState(600);
  const [isSubmittingPricing, setIsSubmittingPricing] = useState(false);

  const isLoading = meQuery.isLoading || venueQuery.isLoading;
  if (isLoading) return { view: 'Loading', props: { translate } } as const;

  // Helper for adding photos with min 2, max 6 limit
  async function handleFilesUpload(
    files: FileList | null,
    target: 'onboarding' | 'manage' | 'court',
  ) {
    if (!files || files.length === 0) return;
    const current =
      target === 'onboarding'
        ? venuePhotos
        : target === 'manage'
          ? editPhotosList
          : courtMgmt.newCourtPhotos;
    const remaining = 6 - current.length;
    if (remaining <= 0) {
      return toast.warning(translate('Maximum 6 photos allowed.'), translate('Limit Reached'));
    }
    const filesToRead = Array.from(files).slice(0, remaining);
    const readPromises = filesToRead.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    );
    try {
      const dataUrls = await Promise.all(readPromises);
      if (target === 'onboarding') {
        setVenuePhotos((prev) => [...prev, ...dataUrls].slice(0, 6));
      } else if (target === 'manage') {
        setEditPhotosList((prev) => [...prev, ...dataUrls].slice(0, 6));
      } else {
        courtMgmt.setNewCourtPhotos((prev) => [...prev, ...dataUrls].slice(0, 6));
      }
      toast.success(
        translate('Loaded {{value0}} photo(s) from your device.', { value0: dataUrls.length }),
        translate('Photos Added'),
      );
    } catch {
      toast.error(translate('Failed to read image files.'), translate('Upload Error'));
    }
  }

  function removeEditPhoto(idx: number) {
    setEditPhotosList((prev) => prev.filter((_, i) => i !== idx));
  }

  // CASE 1: Owner request is pending Super Admin approval
  if (user?.status === 'pending') {
    return { view: 'Pending', props: { meQuery, toast, translate, user, venueQuery } } as const;
  }

  // CASE 2: Owner is approved, but has not sent their venue info yet
  if (!venue) {
    return {
      view: 'Onboarding',
      props: {
        areas,
        handleFilesUpload,
        handleRegisterVenue,
        initialCourtName,
        initialHourlyRate,
        initialIsIndoor,
        initialSize,
        initialSport,
        initialSurface,
        isSubmittingVenue,
        newAddress,
        newAreaId,
        newDescription,
        newMaxHours,
        newPhone,
        newVenueName,
        removeOnboardingPhoto,
        setInitialCourtName,
        setInitialHourlyRate,
        setInitialIsIndoor,
        setInitialSize,
        setInitialSport,
        setInitialSurface,
        setNewAddress,
        setNewAreaId,
        setNewDescription,
        setNewMaxHours,
        setNewPhone,
        setNewVenueName,
        translate,
        user,
        venuePhotos,
      },
    } as const;
  }

  // CASE 3: Venue exists — show venue management overview
  const activeVenue = venue;
  const currentPhotos: string[] = photoUrls(activeVenue.photos);

  async function handleSavePhotos(e: React.FormEvent) {
    e.preventDefault();
    if (editPhotosList.length < 2 || editPhotosList.length > 6) {
      return toast.warning(
        translate('Venue requires between 2 and 6 photos.'),
        translate('Invalid Photo Count'),
      );
    }
    setIsSubmittingPhotos(true);
    try {
      await ownerApi.uploadPhotos(
        activeVenue.id,
        editPhotosList.map((url) => ({ url, mimeType: 'image/jpeg' })),
      );
      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      setShowManagePhotosModal(false);
      toast.success(translate('Venue photos updated successfully.'), translate('Photos Saved'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update photos',
        translate('Upload Error'),
      );
    } finally {
      setIsSubmittingPhotos(false);
    }
  }

  async function handleSetPricing(courtId: string) {
    setIsSubmittingPricing(true);
    try {
      const rules = Array.from({ length: 7 }, (_, day) => ({
        dayOfWeek: day,
        startMinute: 0,
        endMinute: 1440,
        pricePiastres: priceEgp * 100,
      }));
      await ownerApi.setPriceRules(activeVenue.id, courtId, rules);
      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      setPricingCourtId('');
      toast.success(
        translate('Hourly rate updated. Activates in 24 hours per platform rules.'),
        translate('Pricing Saved'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update pricing',
        translate('Pricing Error'),
      );
    } finally {
      setIsSubmittingPricing(false);
    }
  }

  async function handleSubmitForApproval() {
    if (
      (await ask({
        title: translate('Submit venue'),
        message: translate('Submit this venue for platform verification and public listing?'),
      })) === null
    )
      return;
    try {
      await ownerApi.submit(activeVenue.id);
      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      toast.success(
        translate('Venue submitted to super admin for verification.'),
        translate('Submitted for Approval'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Submission failed',
        translate('Submission Error'),
      );
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
      case 'pending':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-400';
      default:
        return 'bg-slate-700/50 border-slate-600 text-slate-600 dark:text-slate-300';
    }
  };

  return {
    view: 'Content',
    props: {
      ...courtMgmt,
      ...venueEdit,
      currentPhotos,
      editPhotosList,
      getStatusBadge,
      handleFilesUpload,
      handleSavePhotos,
      handleSetPricing,
      handleSubmitForApproval,
      isSubmittingPhotos,
      isSubmittingPricing,
      priceEgp,
      pricingCourtId,
      removeEditPhoto,
      setEditPhotosList,
      setPriceEgp,
      setPricingCourtId,
      setShowManagePhotosModal,
      showManagePhotosModal,
      translate,
      venue,
    },
  } as const;
}
