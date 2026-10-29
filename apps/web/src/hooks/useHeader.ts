import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../store/AuthStore';
import { useLanguage } from '../store/LanguageStore';
import { useToast } from '../components/feedback/ToastContext';
import { ownerApi, trustApi } from '../services/api';

export function useHeader() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  const profile = useQuery({
    queryKey: ['user-avatar', user?.id, user?.role],
    queryFn: () => (user?.role === 'owner' ? ownerApi.profile() : trustApi.profile()),
    enabled: Boolean(user && user.role !== 'admin'),
  });
  const toggleLanguage = () => {
    void setLanguage(language === 'en' ? 'ar' : 'en').catch(() =>
      toast.error(
        translate('Could not save your language preference. Please try again.'),
        translate('Error'),
      ),
    );
  };
  const logout = async () => {
    await signOut();
    navigate('/');
    toast.info(translate('You have safely signed out.'), translate('Signed Out'));
  };
  return {
    user,
    avatarUrl: profile.data?.photoUrl,
    language,
    translate,
    menuOpen,
    setMenuOpen,
    toggleLanguage,
    logout,
  };
}
