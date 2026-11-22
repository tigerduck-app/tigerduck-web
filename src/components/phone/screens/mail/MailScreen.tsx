import { useMemo, useState } from 'react';
import { demo, demoTime, text, type DemoMail } from '../../lib/demo';
import { k, usePhoneLocale } from '../../lib/i18n';
import { listDate } from '../../lib/format';
import { Icon } from '../../ui/Icon';
import { useLongPress, useMenu, type MenuEntry } from '../../ui/Menu';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { usePresenter } from '../../ui/sheetContext';
import { SwipeRow } from '../../ui/SwipeRow';
import { EmptyState, SyncDot } from '../../ui/controls';
import { useRefresh } from '../useRefresh';
import { ComposeSheet } from './ComposeSheet';
import { MailMessagePage } from './MailMessagePage';

type Folder = 'all' | 'inbox' | 'sent' | 'drafts';

export interface Mail {
  id: number;
  folder: Exclude<Folder, 'all'>;
  message: DemoMail;
  date: number;
  seen: boolean;
  flagged: boolean;
}

const FOLDERS: { id: Folder; key: string }[] = [
  { id: 'all', key: k('school_mail_folder_all') },
  { id: 'inbox', key: k('school_mail_folder_inbox') },
  { id: 'sent', key: k('school_mail_folder_sent') },
  { id: 'drafts', key: k('school_mail_folder_drafts') },
];

/** Mail from outside the school's domains, which the app badges. */
export function isExternal(address: string): boolean {
  const domain = address.split('@')[1]?.toLowerCase() ?? '';
  return !(domain === 'ntust.edu.tw' || domain.endsWith('.ntust.edu.tw'));
}

function initialMail(): Mail[] {
  return (demo.mail?.messages ?? []).map((message, id) => ({
    id,
    folder: message.folder === 'sent' || message.folder === 'drafts' ? message.folder : 'inbox',
    message,
    date: demoTime(message.date) ?? 0,
    seen: message.seen ?? true,
    flagged: false,
  }));
}

export function MailScreen({ now }: { now: number }) {
  const { t } = usePhoneLocale();
  const nav = useNav();
  const presenter = usePresenter();
  const { busy, refresh } = useRefresh();
  const [folder, setFolder] = useState<Folder>('all');
  const [mail, setMail] = useState(initialMail);
  const shown = useMemo(
    () =>
      mail
        .filter((item) => (folder === 'all' ? item.folder !== 'drafts' : item.folder === folder))
        .sort((a, b) => b.date - a.date),
    [mail, folder]
  );
  const update = (id: number, change: Partial<Mail>) =>
    setMail((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const remove = (id: number) => setMail((list) => list.filter((item) => item.id !== id));
  const open = (item: Mail) => {
    update(item.id, { seen: true });
    nav.push(<MailMessagePage mail={item} onDelete={() => remove(item.id)} />);
  };

  return (
    <Page
      title={t('feature_school_mail')}
      titleMode="bar"
      onRefresh={refresh}
      trailing={
        <>
          <SyncDot busy={busy} label={t('feature_school_mail')} />
          <span className="td-ph-glass td-ph-glass-pill">
            <button type="button" aria-label={t('school_mail_unread_only')}>
              <Icon name="filter" />
            </button>
            <button type="button" aria-label={t('school_mail_search_prompt')}>
              <Icon name="search" />
            </button>
          </span>
        </>
      }
      overlay={
        <button
          type="button"
          className="td-ph-fab"
          aria-label={t('school_mail_compose')}
          onClick={() =>
            presenter.present(
              <ComposeSheet
                onSend={(sent) =>
                  setMail((list) => [
                    ...list,
                    { id: list.length + 100, folder: 'sent', message: sent, date: Date.now(), seen: true, flagged: false },
                  ])
                }
              />,
              { detents: ['large'] }
            )
          }
        >
          <Icon name="compose" />
        </button>
      }
    >
      <div className="td-ph-chips" role="group" aria-label={t('feature_school_mail')}>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={folder === f.id ? 'td-ph-chip' : 'td-ph-chip td-ph-glass'}
            aria-pressed={folder === f.id}
            onClick={() => setFolder(f.id)}
          >
            {t(f.key)}
          </button>
        ))}
      </div>
      <div className="td-ph-list">
        {shown.map((item) => (
                <MailRow
                  key={item.id}
                  item={item}
                  now={now}
                  onOpen={() => open(item)}
                  onToggleRead={() => update(item.id, { seen: !item.seen })}
                  onToggleFlag={() => update(item.id, { flagged: !item.flagged })}
                  onDelete={() => remove(item.id)}
                />
        ))}
        {shown.length === 0 ? <EmptyState icon="envelopeOpen" title={t('school_mail_empty_title')} /> : null}
      </div>
    </Page>
  );
}

function MailRow({
  item,
  now,
  onOpen,
  onToggleRead,
  onToggleFlag,
  onDelete,
}: {
  item: Mail;
  now: number;
  onOpen: () => void;
  onToggleRead: () => void;
  onToggleFlag: () => void;
  onDelete: () => void;
}) {
  const { t, locale } = usePhoneLocale();
  const openMenu = useMenu();
  const { message } = item;
  const sender =
    item.folder === 'inbox' ? message.from.name || message.from.address : message.to?.[0]?.name ?? message.from.name;
  const readLabel = item.seen ? t('school_mail_mark_unread') : t('school_mail_mark_read');
  const flagLabel = item.flagged ? t('school_mail_unflag') : t('school_mail_flag');
  const entries: MenuEntry[] = [
    { label: t('school_mail_reply'), icon: 'reply', onSelect: onOpen },
    { label: t('school_mail_forward'), icon: 'forward', onSelect: onOpen },
    'divider',
    { label: readLabel, icon: item.seen ? 'envelopeBadge' : 'envelopeOpen', onSelect: onToggleRead },
    { label: flagLabel, icon: 'flag', onSelect: onToggleFlag },
    { label: t('school_mail_delete'), icon: 'trash', destructive: true, onSelect: onDelete },
  ];
  const longPress = useLongPress((target) => openMenu(target, entries));
  return (
    <SwipeRow
      className="td-ph-list-item"
      fullSwipe
      leading={[
        {
          label: readLabel,
          icon: item.seen ? 'envelopeBadge' : 'envelopeOpen',
          color: 'var(--ph-accent)',
          onTrigger: onToggleRead,
        },
      ]}
      trailing={[
        { label: t('school_mail_delete'), icon: 'trashFill', color: 'var(--ph-red)', removes: true, onTrigger: onDelete },
        { label: flagLabel, icon: 'flag', color: 'var(--ph-orange)', onTrigger: onToggleFlag },
        { label: t('school_mail_message_actions'), icon: 'dotsCircle', color: 'var(--ph-gray)', onTrigger: () => {} },
      ]}
    >
      <button
        type="button"
        className="td-ph-card td-ph-mail-row"
        {...longPress.handlers}
        onClick={() => {
          if (!longPress.consumeFired()) onOpen();
        }}
      >
        <span className="td-ph-mail-head">
          {!item.seen ? <span className="td-ph-dot td-ph-mail-dot" aria-label={t('bulletin_unread_dot_label')} /> : null}
          <span className={item.seen ? 'td-ph-mail-sender' : 'td-ph-mail-sender td-ph-mail-sender--unread'}>{sender}</span>
          {item.folder === 'inbox' && isExternal(message.from.address) ? (
            <span className="td-ph-external">{t('school_mail_external_badge')}</span>
          ) : null}
          {item.flagged ? <Icon name="flag" className="td-ph-mail-flag" /> : null}
          {message.attachments?.length ? <Icon name="paperclip" className="td-ph-mail-clip" /> : null}
          <span className="td-ph-mail-date">{listDate(item.date, now)}</span>
        </span>
        <span className={item.seen ? 'td-ph-mail-subject' : 'td-ph-mail-subject td-ph-mail-subject--unread'}>
          {text(message.subject, locale)}
        </span>
      </button>
    </SwipeRow>
  );
}
