import { useId, useState } from 'react';
import { demo, text, type DemoMail } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { Icon } from '../../ui/Icon';
import { Page } from '../../ui/Page';
import { useInSheet } from '../../ui/sheetContext';
import { GlassButton } from '../../ui/controls';

/** A recipient and subject the composer opens with, as a reply or a forward. */
export interface ComposeDraft {
  to: string;
  subject: string;
}

/** The app's MailReplyComposer.replySubject and forwardSubject: a prefix the subject lacks. */
export function draftFor(mode: 'reply' | 'forward', from: string, subject: string): ComposeDraft {
  const has = (prefixes: string[]) => prefixes.some((prefix) => subject.toLowerCase().startsWith(prefix));
  return mode === 'reply'
    ? { to: from, subject: has(['re:']) ? subject : `Re: ${subject}` }
    : { to: '', subject: has(['fwd:', 'fw:']) ? subject : `Fwd: ${subject}` };
}

/** A new message, a reply or a forward; sending files it under Sent, as the demo has no server. */
export function ComposeSheet({ draft, onSend }: { draft?: ComposeDraft; onSend: (mail: DemoMail) => void }) {
  const { t, locale } = usePhoneLocale();
  const sheet = useInSheet();
  const id = useId();
  const [to, setTo] = useState(draft?.to ?? '');
  const [subject, setSubject] = useState(draft?.subject ?? '');
  const [body, setBody] = useState('');
  const [missingRecipient, setMissingRecipient] = useState(false);
  const me = demo.mail;

  const send = () => {
    if (!to.trim()) {
      setMissingRecipient(true);
      return;
    }
    onSend({
      folder: 'sent',
      from: { name: text(me?.displayName, locale), address: `${(me?.studentId ?? demo.studentId).toLowerCase()}@mail.ntust.edu.tw` },
      to: [{ address: to.trim() }],
      subject: subject,
      date: new Date().toISOString(),
      seen: true,
      plain: body,
    });
    sheet?.dismiss();
  };

  return (
    <Page
      title={t('school_mail_compose')}
      titleMode="inline"
      leading={<GlassButton text={t('action_cancel')} label={t('action_cancel')} onClick={() => sheet?.dismiss()} />}
      trailing={
        <button type="button" className="td-ph-send" aria-label={t('school_mail_send')} onClick={send}>
          <Icon name="send" />
        </button>
      }
    >
      <div className="td-ph-compose">
        <label htmlFor={`${id}-to`}>
          <span>{t('school_mail_to')}:</span>
          <input
            id={`${id}-to`}
            type="email"
            value={to}
            autoComplete="off"
            aria-invalid={missingRecipient}
            onChange={(event) => {
              setTo(event.target.value);
              setMissingRecipient(false);
            }}
          />
        </label>
        {missingRecipient ? (
          <p className="td-ph-compose-error" role="alert">
            {t('school_mail_no_recipient')}
          </p>
        ) : null}
        <label htmlFor={`${id}-subject`}>
          <span>{t('school_mail_subject')}:</span>
          <input id={`${id}-subject`} value={subject} onChange={(event) => setSubject(event.target.value)} />
        </label>
        <textarea
          aria-label={t('school_mail_body')}
          placeholder={t('school_mail_body')}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>
    </Page>
  );
}
