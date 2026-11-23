import { text } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { fileSize } from '../../lib/format';
import { monthDayTime } from '../../lib/time';
import { Icon } from '../../ui/Icon';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { usePresenter } from '../../ui/sheetContext';
import { DemoHtml, Group, Row } from '../../ui/controls';
import { ComposeSheet, draftFor } from './ComposeSheet';
import { isExternal, useMailbox, type Mail } from './MailScreen';
import { MoveSheet } from './MoveSheet';

const PASSWORD_BAIT = /驗證|重新登入|密碼|password|verify your account|mailbox (is )?full/i;

/** A message as the mailbox holds it now; `opened` once another mail page has deleted it. */
export function MailMessagePage({ mail: opened }: { mail: Mail }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const presenter = usePresenter();
  const mailbox = useMailbox();
  const mail = mailbox.mail.find((item) => item.id === opened.id) ?? opened;
  const { message } = mail;
  const subject = text(message.subject, locale) || t('school_mail_no_subject');
  const html = message.html ? text(message.html, locale) : null;
  const plain = message.plain ? text(message.plain, locale) : '';
  const external = isExternal(message.from.address);
  const bait = external && PASSWORD_BAIT.test(`${subject}\n${html ?? plain}`);
  // The site loads nothing from other servers, as the app blocks remote images by default.
  const blockedImages = html !== null && message.remoteImages === true;
  const sender = message.from.name || message.from.address;
  const compose = (mode: 'reply' | 'forward') =>
    presenter.present(<ComposeSheet draft={draftFor(mode, message.from.address, subject)} onSend={mailbox.send} />, {
      detents: ['large'],
    });

  return (
    <Page
      title={subject}
      overlay={
        <div className="td-ph-mail-toolbar td-ph-glass" role="toolbar" aria-label={t('school_mail_message_actions')}>
          <button
            type="button"
            aria-label={t('school_mail_delete')}
            onClick={() => mailbox.trash(mail, nav.pop)}
          >
            <Icon name="trash" />
          </button>
          <button
            type="button"
            aria-label={t('school_mail_move_to')}
            onClick={() =>
              presenter.present(
                <MoveSheet
                  from={mail.folder}
                  onMove={(folder) => {
                    mailbox.update(mail.id, { folder });
                    nav.pop();
                  }}
                />
              )
            }
          >
            <Icon name="folder" />
          </button>
          <button type="button" aria-label={t('school_mail_reply')} onClick={() => compose('reply')}>
            <Icon name="reply" />
          </button>
          <button type="button" aria-label={t('school_mail_forward')} onClick={() => compose('forward')}>
            <Icon name="forward" />
          </button>
        </div>
      }
    >
      <div className="td-ph-mail-from">
        <span className="td-ph-avatar" aria-hidden="true">
          {sender.slice(0, 1)}
        </span>
        <span className="td-ph-row-main">
          <span className="td-ph-mail-from-name">
            <b>{sender}</b>
            {external ? <span className="td-ph-external">{t('school_mail_external_badge')}</span> : null}
          </span>
          <span className="td-ph-caption">{message.from.address}</span>
          {message.to?.length ? (
            <span className="td-ph-caption">
              {t('school_mail_to')}: {message.to.map((to) => to.name || to.address).join(', ')}
            </span>
          ) : null}
        </span>
        <span className="td-ph-caption">{monthDayTime(mail.date)}</span>
      </div>
      {bait ? (
        <div className="td-ph-banner td-ph-banner--danger" role="note">
          <Icon name="eyeSlash" />
          {t('school_mail_warning_password')}
        </div>
      ) : null}
      {blockedImages ? (
        <div className="td-ph-banner" role="note">
          <Icon name="eyeSlash" />
          {t('school_mail_remote_images_blocked')}
        </div>
      ) : null}
      <div className="td-ph-card td-ph-pad td-ph-mail-body">
        {html !== null ? <DemoHtml html={html} /> : <p className="td-ph-html td-ph-plain">{plain}</p>}
      </div>
      {message.attachments?.length ? (
        <Group header={t('school_mail_attachments')}>
          {message.attachments.map((file) => (
            <Row key={text(file.name, locale)} icon="paperclip" title={text(file.name, locale)} value={fileSize(file.size)} />
          ))}
        </Group>
      ) : null}
    </Page>
  );
}
