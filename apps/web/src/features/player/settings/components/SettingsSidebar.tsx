import { Bell, Globe, HelpCircle, Mail } from 'lucide-react';
import { SectionTabs, type SectionTab } from '../../../../components/ui/SectionTabs';
import type { SettingsContentProps } from '../types';

export function SettingsSidebar({
  activeTab,
  setActiveTab,
  unreadCount,
  user,
  translate,
}: Pick<
  SettingsContentProps,
  'activeTab' | 'setActiveTab' | 'unreadCount' | 'user' | 'translate'
>) {
  const tabs: SectionTab<SettingsContentProps['activeTab']>[] = [
    { id: 'inbox', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'preferences', label: 'Alert Channels', icon: Mail },
    { id: 'regional', label: 'Language & Region', icon: Globe },
    { id: 'support', label: 'Support & Help', icon: HelpCircle },
  ];
  return (
    <aside className="space-y-4 lg:col-span-4">
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#13221f]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700 dark:bg-lime-400/20 dark:text-lime-300">
          {user?.name?.slice(0, 1).toUpperCase() ?? 'P'}
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-sm">{user?.name ?? translate('Player')}</strong>
          <span className="block truncate text-xs text-slate-500">{user?.email}</span>
        </div>
      </div>
      <SectionTabs
        items={tabs}
        value={activeTab}
        onChange={setActiveTab}
        label="Settings Navigation"
        vertical
      />
    </aside>
  );
}
