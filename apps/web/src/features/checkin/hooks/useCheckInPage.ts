import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { venueApi } from '../../../services/api';
import { useLanguage } from '../../../store/LanguageStore';
import type { CheckInData, CheckInContentProps } from '../types';

export function useCheckInPage() {
  const [params] = useSearchParams();
  const rawCode = params.get('code') || '';
  const cleanCode = rawCode.trim().replace(/^#/, '');

  const [loading, setLoading] = useState(Boolean(cleanCode));
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CheckInData | null>(null);
  const { translate, locale } = useLanguage();

  useEffect(() => {
    if (!cleanCode) {
      setError(translate('No booking reference provided in check-in link.'));
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    venueApi
      .checkin(cleanCode)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : translate('Could not check in player. Please verify the booking code.'),
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cleanCode, translate]);

  const formattedTime = data?.startsAt
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
        timeZone: 'Africa/Cairo',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(data.startsAt))
    : '';

  return {
    view: 'Content' as const,
    props: {
      loading,
      error,
      data,
      formattedTime,
      translate,
    } satisfies CheckInContentProps,
  };
}
