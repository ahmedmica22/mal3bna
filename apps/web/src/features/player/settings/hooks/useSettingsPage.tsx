import { useLanguage } from '../../../../store/LanguageStore';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../../../services/api';
import { useAuth } from '../../../../store/AuthStore';
import { useToast } from '../../../../components/feedback/ToastContext';

export function useSettingsPage() {
  const { translate, locale, language: lang, setLanguage } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences' | 'regional' | 'support'>(
    'inbox',
  );
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  const inboxQuery = useQuery({
    queryKey: ['notifications-inbox'],
    queryFn: () => notificationApi.inbox(),
  });

  const preferencesQuery = useQuery({
    queryKey: ['notifications-preferences'],
    queryFn: () => notificationApi.preferences(),
  });

  const defaultCategories = [
    {
      category: 'booking_confirmation',
      label: translate('Booking Confirmations'),
      desc: translate('Instant alerts when slots are held and paid'),
    },
    {
      category: 'match_reminder',
      label: translate('Match Reminders'),
      desc: translate('Upcoming kickoff notifications 2 hours before match'),
    },
    {
      category: 'cancellation_refund',
      label: translate('Cancellations & Refunds'),
      desc: translate('Updates on cancellation previews and processed refunds'),
    },
    {
      category: 'no_show_alert',
      label: translate('Match-day Status & Disputes'),
      desc: translate('Alerts when match check-in or no-show is recorded'),
    },
  ];

  const [prefsState, setPrefsState] = useState<Record<string, { email: boolean; push: boolean }>>(
    {},
  );

  useEffect(() => {
    if (preferencesQuery.data) {
      const mapped: Record<string, { email: boolean; push: boolean }> = {};
      defaultCategories.forEach((cat) => {
        const found = preferencesQuery.data?.find((p) => p.category === cat.category);
        mapped[cat.category] = {
          email: found ? found.emailEnabled : true,
          push: found ? found.pushEnabled : true,
        };
      });
      setPrefsState(mapped);
    }
  }, [preferencesQuery.data]);

  async function handleMarkRead(id: string) {
    try {
      await notificationApi.markRead(id);
      await queryClient.invalidateQueries({ queryKey: ['notifications-inbox'] });
      toast.info(translate('Notification marked as read.'), translate('Inbox Updated'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not mark notification as read',
        translate('Error'),
      );
    }
  }

  async function togglePreference(category: string, type: 'email' | 'push') {
    const current = prefsState[category] ?? { email: true, push: true };
    const updated = {
      ...current,
      [type]: !current[type],
    };
    setPrefsState({
      ...prefsState,
      [category]: updated,
    });

    setPrefSaving(true);
    setPrefSuccess(false);
    try {
      await notificationApi.setPreference(category, updated.email, updated.push);
      await queryClient.invalidateQueries({ queryKey: ['notifications-preferences'] });
      setPrefSuccess(true);
      toast.success(translate('Channel preference saved.'), translate('Preferences Updated'));
      setTimeout(() => setPrefSuccess(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update notification preference',
        translate('Error'),
      );
    } finally {
      setPrefSaving(false);
    }
  }

  function handleLanguageChange(newLang: 'en' | 'ar') {
    void setLanguage(newLang).catch(() => {
      toast.error(
        translate('Could not save your language preference. Please try again.'),
        translate('Error'),
      );
    });
  }

  const notifications = inboxQuery.data ?? [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return {
    view: 'Content',
    props: {
      activeTab,
      defaultCategories,
      handleLanguageChange,
      handleMarkRead,
      inboxQuery,
      lang,
      locale,
      notifications,
      prefSaving,
      prefSuccess,
      prefsState,
      setActiveTab,
      togglePreference,
      translate,
      unreadCount,
      user,
    },
  } as const;
}
