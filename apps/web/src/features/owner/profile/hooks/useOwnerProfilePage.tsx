import { useLanguage } from '../../../../store/LanguageStore';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../store/AuthStore';
import { useToast } from '../../../../components/feedback/ToastContext';
import { ownerApi } from '../../../../services/api';

export function useOwnerProfilePage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['owner-profile'],
    queryFn: () => ownerApi.profile(),
  });

  const venueQuery = useQuery({
    queryKey: ['owner-mine-venue'],
    queryFn: () => ownerApi.mine(),
  });

  useEffect(() => {
    if (profileQuery.data) {
      if (profileQuery.data.name) setName(profileQuery.data.name);
      if (profileQuery.data.phone) setPhone(profileQuery.data.phone);
      if (profileQuery.data.photoUrl) setPhotoUrl(profileQuery.data.photoUrl);
    } else if (user) {
      setName(user.name);
      if (typeof user.phone === 'string') setPhone(user.phone);
    }
  }, [profileQuery.data, user]);

  if (profileQuery.isLoading) {
    return { view: 'Loading', props: { translate } } as const;
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        translate('Image size exceeds 5MB limit. Please choose a smaller photo.'),
        translate('File Too Large'),
      );
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setPhotoUrl(dataUrl);
        try {
          await ownerApi.updateProfile({ photoUrl: dataUrl });
          await queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
          await queryClient.invalidateQueries({ queryKey: ['user-avatar'] });
          toast.success(
            translate('Your profile photo has been updated successfully.'),
            translate('Photo Saved'),
          );
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : 'Failed to save profile photo',
            translate('Upload Error'),
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

  async function handleRemovePhoto() {
    setPhotoUrl(null);
    try {
      await ownerApi.updateProfile({ photoUrl: '' });
      await queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
      await queryClient.invalidateQueries({ queryKey: ['user-avatar'] });
      toast.info(translate('Profile photo removed.'), translate('Photo Removed'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to remove photo',
        translate('Error'),
      );
    }
  }

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: { name?: string; phone?: string } = {};
      if (name.trim()) updateData.name = name.trim();
      if (phone.trim()) updateData.phone = phone.trim();
      await ownerApi.updateProfile(updateData);
      await queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.invalidateQueries({ queryKey: ['user-avatar'] });
      toast.success(translate('Your account details have been saved.'), translate('Profile Saved'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save account details',
        translate('Save Error'),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const venue = venueQuery.data;

  return {
    view: 'Content',
    props: {
      handlePhotoUpload,
      handleRemovePhoto,
      handleSaveDetails,
      isSaving,
      isUploadingPhoto,
      name,
      phone,
      photoUrl,
      setName,
      setPhone,
      translate,
      user,
      venue,
    },
  } as const;
}
