import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { domMin, LazyMotion } from 'motion/react';
import type { Locale } from '@/lib/locale';
import { LocaleContext, translator, usePhoneLocale, type PhoneLocale } from './lib/i18n';
import { useNow } from './lib/time';
import { useMenu, MenuHost } from './ui/Menu';
import { NavStack } from './ui/NavStack';
import { SheetHost } from './ui/Sheet';
import { StatusBar } from './ui/StatusBar';
import { TabBar, type TabItem } from './ui/TabBar';
import { HomeScreen } from './screens/home/HomeScreen';
import { ClassTableScreen, useTableChoice } from './screens/classtable/ClassTableScreen';
import { MailScreen } from './screens/mail/MailScreen';
import { LibraryScreen } from './screens/library/LibraryScreen';
import { MoreScreen } from './screens/more/MoreScreen';
import './phone.css';
import './screens.css';

type TabId = 'home' | 'classTable' | 'mail' | 'library' | 'more';

/** The site's own light or dark choice, which the phone follows. */
function useSiteIsDark(): boolean {
  const read = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const update = () => setDark(read());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', update);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, []);
  return dark;
}

export default function PhoneApp({ locale }: { locale: Locale }) {
  const dark = useSiteIsDark();
  const value = useMemo<PhoneLocale>(() => ({ locale, t: translator(locale) }), [locale]);
  // `m` components need a renderer; domMin is the smallest feature bundle that has one.
  return (
    <LazyMotion features={domMin} strict>
      <LocaleContext.Provider value={value}>
        <div className={dark ? 'td-ph-app td-ph-app--dark' : 'td-ph-app'} lang={locale === 'zh' ? 'zh-Hant' : 'en'}>
          <MenuHost>
            <Tabs />
          </MenuHost>
        </div>
      </LocaleContext.Provider>
    </LazyMotion>
  );
}

function Tabs() {
  const now = useNow();
  const { t } = usePhoneLocale();
  const [tab, setTab] = useState<TabId>('home');
  const openMenu = useMenu();
  const tables = useTableChoice();
  const tabs: TabItem<TabId>[] = [
    { id: 'home', label: t('feature_home_short'), icon: 'house' },
    { id: 'classTable', label: t('feature_class_table_short'), icon: 'classTable' },
    { id: 'mail', label: t('feature_school_mail_short'), icon: 'envelope' },
    { id: 'library', label: t('feature_library_short'), icon: 'books' },
    { id: 'more', label: t('feature_more_short'), icon: 'more' },
  ];
  const screens: Record<TabId, ReactNode> = {
    home: <HomeScreen now={now} />,
    classTable: <ClassTableScreen now={now} tables={tables} />,
    mail: <MailScreen now={now} />,
    library: <LibraryScreen />,
    more: <MoreScreen now={now} tables={tables} />,
  };
  return (
    <>
      <SheetHost>
        {tabs.map(({ id }) => (
          <div key={id} className="td-ph-tab" hidden={id !== tab} role="tabpanel">
            <NavStack root={screens[id]} />
          </div>
        ))}
        <TabBar
          tabs={tabs}
          selected={tab}
          onSelect={setTab}
          label={t('tab_editor_section_current_tabs')}
          onLongPress={(id, anchor) => {
            if (id !== 'classTable') return;
            openMenu(anchor, tables.menu(() => setTab('classTable')));
          }}
        />
      </SheetHost>
      <StatusBar now={now} />
      <div className="td-ph-home-indicator" />
    </>
  );
}
