import { PageTemplate } from '../../../../components/layout/PageTemplate';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { InboxPanel } from '../components/InboxPanel';
import { NotificationPreferencesPanel } from '../components/NotificationPreferencesPanel';
import { LanguagePreferencesPanel } from '../components/LanguagePreferencesPanel';
import { SupportPanel } from '../components/SupportPanel';
import type { SettingsContentProps } from '../types';

export function SettingsContent(props: SettingsContentProps) {
  return (
    <PageTemplate
      eyebrow={props.translate('ACCOUNT SETTINGS & INBOX')}
      title={props.user?.name ?? props.translate('Settings')}
      className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <SettingsSidebar {...props} />
        <section className="lg:col-span-8">
          <InboxPanel {...props} />
          <NotificationPreferencesPanel {...props} />
          <LanguagePreferencesPanel {...props} />
          <SupportPanel {...props} />
        </section>
      </div>
    </PageTemplate>
  );
}
