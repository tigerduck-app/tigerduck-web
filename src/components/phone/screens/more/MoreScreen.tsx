import type { ReactNode } from 'react';
import { k, usePhoneLocale } from '../../lib/i18n';
import { Icon, type IconName } from '../../ui/Icon';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { GlassButton, Group, Row } from '../../ui/controls';
import { ClassTableScreen, type useTableChoice } from '../classtable/ClassTableScreen';
import { HomeScreen } from '../home/HomeScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MailScreen } from '../mail/MailScreen';
import { BulletinsPage } from './BulletinsPage';
import { CalendarPage } from './CalendarPage';
import { EmptyClassroomPage } from './EmptyClassroomPage';
import { InfoSystemPage } from './InfoSystemPage';
import { ScoresPage } from './ScoresPage';

type Tables = ReturnType<typeof useTableChoice>;

interface Feature {
  key: string;
  icon: IconName;
  page: (now: number, tables: Tables) => ReactNode;
}

/** The implemented features in More's order, by `FeatureCategory`. */
const CATEGORIES: { key: string; features: Feature[] }[] = [
  {
    key: k('more_section_pages'),
    features: [
      { key: k('feature_home'), icon: 'house', page: (now) => <HomeScreen now={now} /> },
      { key: k('feature_class_table'), icon: 'classTable', page: (now, tables) => <ClassTableScreen now={now} tables={tables} /> },
      { key: k('feature_calendar'), icon: 'calendar', page: (now) => <CalendarPage now={now} /> },
      { key: k('feature_school_mail'), icon: 'envelope', page: (now) => <MailScreen now={now} /> },
    ],
  },
  {
    key: k('feature_category_academic'),
    features: [
      { key: k('feature_score'), icon: 'chart', page: () => <ScoresPage /> },
      { key: k('feature_information_system'), icon: 'bank', page: () => <InfoSystemPage /> },
    ],
  },
  {
    key: k('feature_category_library'),
    features: [{ key: k('feature_library'), icon: 'books', page: () => <LibraryScreen /> }],
  },
  {
    key: k('feature_category_life'),
    features: [
      { key: k('feature_announcements'), icon: 'megaphone', page: (now) => <BulletinsPage now={now} /> },
      { key: k('feature_empty_classroom'), icon: 'buildings', page: (now) => <EmptyClassroomPage now={now} /> },
    ],
  },
];

export function MoreScreen({ now, tables }: { now: number; tables: Tables }) {
  const { t } = usePhoneLocale();
  const nav = useNav();
  return (
    <Page
      title={t('feature_more')}
      titleMode="bar"
      trailing={<GlassButton icon="gear" label={t('feature_settings')} onClick={() => nav.push(<SettingsPage />)} />}
    >
      {CATEGORIES.map((category) => (
        <section key={category.key} className="td-ph-section td-ph-more-section">
          <h2 className="td-ph-section-title">{t(category.key)}</h2>
          <div className="td-ph-feature-grid">
            {category.features.map((feature) => (
              <button
                key={feature.key}
                type="button"
                className="td-ph-card td-ph-feature"
                onClick={() => nav.push(feature.page(now, tables))}
              >
                <Icon name={feature.icon} />
                <span>{t(feature.key)}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </Page>
  );
}

function SettingsPage() {
  const { t, locale } = usePhoneLocale();
  return (
    <Page title={t('feature_settings')}>
      <Group header={t('settings_section_appearance')}>
        <Row title={t('settings_accent_color')} value={<span className="td-ph-swatch" />} />
        <Row title={t('settings_app_icon')} />
      </Group>
      <Group header={t('settings_section_display')}>
        <Row
          title={t('settings_language')}
          value={locale === 'zh' ? t('settings_language_traditional_chinese') : t('settings_language_english')}
        />
      </Group>
      <Group header={t('settings_section_about')}>
        <Row title={t('settings_official_website')} value="tigerduck.app" />
      </Group>
    </Page>
  );
}
