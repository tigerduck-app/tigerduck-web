import { demo, text, type DemoPortalEntry } from '../../lib/demo';
import { k, usePhoneLocale } from '../../lib/i18n';
import { Icon, type IconName } from '../../ui/Icon';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { Group, Row } from '../../ui/controls';

/** The portal's blocks, `PortalLink.Category` in the app. */
const CATEGORIES: { id: string; key: string; detail: string; icon: IconName }[] = [
  { id: 'service-1', key: k('information_system_category_curriculum'), detail: k('information_system_category_curriculum_description'), icon: 'doc' },
  { id: 'service-2', key: k('information_system_category_personal_info'), detail: k('information_system_category_personal_info_description'), icon: 'person' },
  { id: 'service-3', key: k('information_system_category_campus_life'), detail: k('information_system_category_campus_life_description'), icon: 'buildings' },
  { id: 'service-4', key: k('information_system_category_financial_support'), detail: k('information_system_category_financial_support_description'), icon: 'bank' },
  { id: 'service-5', key: k('information_system_category_activities'), detail: k('information_system_category_activities_description'), icon: 'sparkle' },
  { id: 'service-6', key: k('information_system_category_resources'), detail: k('information_system_category_resources_description'), icon: 'books' },
];

export function InfoSystemPage() {
  const { t } = usePhoneLocale();
  const nav = useNav();
  const entries = demo.informationSystem ?? [];
  return (
    <Page title={t('feature_information_system')}>
      <div className="td-ph-feature-grid td-ph-section" style={{ marginTop: 4 }}>
        {CATEGORIES.map((category) => {
          const links = entries.filter((e) => e.category === category.id);
          return (
            <button
              key={category.id}
              type="button"
              className="td-ph-card td-ph-feature td-ph-feature--tall"
              onClick={() => nav.push(<LinksPage title={t(category.key)} links={links} />)}
            >
              <Icon name={category.icon} />
              <span>{t(category.key)}</span>
              <small>{t(category.detail)}</small>
            </button>
          );
        })}
      </div>
    </Page>
  );
}

function LinksPage({ title, links }: { title: string; links: DemoPortalEntry[] }) {
  const { locale } = usePhoneLocale();
  return (
    <Page title={title}>
      <Group>
        {links.map((link) => (
          <Row key={link.url + text(link.name, locale)} title={text(link.name, locale)} subtitle={new URL(link.url).host} value={<Icon name="external" />} chevron={false} />
        ))}
      </Group>
    </Page>
  );
}
