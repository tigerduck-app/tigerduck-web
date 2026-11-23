import { usePhoneLocale } from '../../lib/i18n';
import { Page } from '../../ui/Page';
import { useInSheet } from '../../ui/sheetContext';
import { GlassButton, Group, Row } from '../../ui/controls';
import { MAILBOXES, type Mailbox } from './MailScreen';

/** The app's MailMoveSheet: every mailbox but the one the message is in. */
export function MoveSheet({ from, onMove }: { from: Mailbox; onMove: (to: Mailbox) => void }) {
  const { t } = usePhoneLocale();
  const sheet = useInSheet();
  return (
    <Page
      title={t('school_mail_move_to')}
      titleMode="inline"
      leading={<GlassButton text={t('action_cancel')} label={t('action_cancel')} onClick={() => sheet?.dismiss()} />}
    >
      <Group>
        {MAILBOXES.filter((box) => box.id !== from).map((box) => (
          <Row
            key={box.id}
            title={t(box.key)}
            chevron={false}
            onClick={() => {
              sheet?.dismiss();
              onMove(box.id);
            }}
          />
        ))}
      </Group>
    </Page>
  );
}
