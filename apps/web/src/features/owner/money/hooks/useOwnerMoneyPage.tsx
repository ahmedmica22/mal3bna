import { useLanguage } from '../../../../store/LanguageStore';
import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../../../../services/api';

export function useOwnerMoneyPage() {
  const { translate, locale } = useLanguage();
  const balance = useQuery({
    queryKey: ['owner-balance'],
    queryFn: () => ownerApi.balance(),
  });

  const payouts = useQuery({
    queryKey: ['owner-payouts'],
    queryFn: () => ownerApi.payouts(),
  });

  const report = useQuery({
    queryKey: ['owner-report'],
    queryFn: () => ownerApi.report(),
  });

  if (balance.isLoading || payouts.isLoading)
    return { view: 'Loading', props: { translate } } as const;
  if (balance.isError || payouts.isError) return { view: 'Error', props: { translate } } as const;

  const money = balance.data ?? {};
  const payoutList = payouts.data ?? [];
  const occupancy = report.data;

  return { view: 'Content', props: { locale, money, occupancy, payoutList, translate } } as const;
}
