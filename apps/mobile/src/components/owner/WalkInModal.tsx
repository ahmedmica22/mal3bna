import { ScrollView } from 'react-native';
import { AppSheet, Title, Copy, Field, Action, Shimmer, useMobileDesign } from '../common/MobileDesign';
import { useWalkInForm, type WalkInInput } from '../../hooks/useWalkInForm';
import type { Venue } from '../../types/domain';
export function WalkInModal({
  visible,
  block = false,
  venue,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  block?: boolean;
  venue?: Venue | null;
  onConfirm: (input: WalkInInput) => Promise<boolean>;
  onClose: () => void;
}) {
  const p = useWalkInForm(venue, visible, onConfirm, block);
  const { t, lang } = useMobileDesign();
  if (!visible) return null;
  const time = (value: string) =>
    new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  return (
    <AppSheet title={t(block ? 'block' : 'walkIn')} onClose={onClose}>
      <Copy>
        {t('cairo')} · {p.hours} {t('hours')}
      </Copy>
      <Title small>{t('court')}</Title>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {venue?.courts?.map((court) => (
          <Action
            key={court.id}
            label={court.name}
            secondary={p.courtId !== court.id}
            onPress={() => p.setCourtId(court.id)}
          />
        ))}
      </ScrollView>
      <Title small>{t('date')}</Title>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {p.days.map((day, i) => (
          <Action
            key={day.date}
            label={i === 0 ? t('today') : day.date.slice(5)}
            secondary={p.date !== day.date}
            onPress={() => p.setDate(day.date)}
          />
        ))}
      </ScrollView>
      <Title small>{t('slot')}</Title>
      {p.loading ? (
        <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} width={70} height={42} borderRadius={14} />
          ))}
        </ScrollView>
      ) : p.slots.length === 0 ? (
        <Copy>{t('noSlots')}</Copy>
      ) : (
        <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
          {p.slots.map((slot) => (
            <Action
              key={slot.startsAt}
              label={time(slot.startsAt)}
              secondary={p.startsAt !== slot.startsAt}
              onPress={() => {
                p.setStartsAt(slot.startsAt);
                p.setHours(1);
              }}
            />
          ))}
        </ScrollView>
      )}
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {Array.from({ length: p.maxHours }, (_, index) => index + 1).map((hours) => (
          <Action
            key={hours}
            label={`${hours} ${t('hours')}`}
            secondary={p.hours !== hours}
            onPress={() => p.setHours(hours)}
          />
        ))}
      </ScrollView>
      <Field label={t(block ? 'reason' : 'name')} value={p.name} onChangeText={p.setName} />
      {!block && (
        <>
          <Field
            label={t('phone')}
            value={p.phone}
            onChangeText={p.setPhone}
            keyboardType="phone-pad"
          />
          <Field
            label={`${t('total')} (EGP)`}
            value={p.price}
            onChangeText={p.setPrice}
            keyboardType="decimal-pad"
          />
        </>
      )}
      {p.error && <Copy>{t('error')}</Copy>}
      <Action
        label={t(p.saving ? 'loading' : block ? 'block' : 'walkIn')}
        disabled={!p.valid}
        onPress={() => void p.submit()}
      />
    </AppSheet>
  );
}
