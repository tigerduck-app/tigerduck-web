import { demoTime, text } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { durationText } from '../../lib/format';
import { monthDayTime, useNow } from '../../lib/time';
import { DemoHtml, Group, Row, SectionTitle } from '../../ui/controls';
import { Page } from '../../ui/Page';
import { courseLine, type AssignmentItem } from '../assignments';
import { FileRows } from './FileRows';

/** A Moodle assignment: its due time, description, files and the student's submission. */
export function AssignmentPage({ item }: { item: AssignmentItem }) {
  const { t, locale } = usePhoneLocale();
  const now = useNow();
  const left = item.due - now;
  const submission = item.moodle?.submission;
  const submittedAt = demoTime(submission?.time);
  const isDraft = submission?.status === 'draft';
  return (
    <Page title={item.title}>
      <p className="td-ph-sub" style={{ padding: '0 16px', marginTop: -2 }}>
        {courseLine(item)}
      </p>
      <Group>
        <Row title={t('assignment_detail_due')} value={monthDayTime(item.due)} />
        <Row
          title={t('assignment_detail_submission')}
          value={
            <span style={{ color: item.submitted ? 'var(--ph-green)' : left < 0 ? 'var(--ph-red)' : undefined }}>
              {item.submitted
                ? t('assignment_status_submitted')
                : left < 0
                  ? t('assignment_detail_overdue_by', durationText(-left, locale))
                  : t('assignment_detail_time_left', durationText(left, locale))}
            </span>
          }
        />
      </Group>
      {item.moodle?.intro ? (
        <section className="td-ph-section">
          <SectionTitle>{t('assignment_detail_description')}</SectionTitle>
          <div className="td-ph-card td-ph-pad">
            <DemoHtml html={text(item.moodle.intro, locale)} />
          </div>
        </section>
      ) : null}
      {item.moodle?.attachments?.length ? (
        <Group header={t('school_mail_attachments')}>
          <FileRows files={item.moodle.attachments} />
        </Group>
      ) : null}
      {submission ? (
        <section className="td-ph-section">
          <SectionTitle trailing={isDraft ? <span className="td-ph-tag">{t('assignment_detail_draft')}</span> : null}>
            {t('assignment_detail_submission')}
          </SectionTitle>
          <div className="td-ph-card td-ph-pad">
            {submission.text ? <DemoHtml html={text(submission.text, locale)} /> : null}
            {submittedAt !== null ? (
              <p className="td-ph-caption" style={{ marginTop: 8 }}>
                {t('assignment_detail_submitted_at')} {monthDayTime(submittedAt)}
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <p className="td-ph-group-footer">{t('assignment_detail_not_submitted')}</p>
      )}
      <div className="td-ph-section" style={{ padding: '0 16px' }}>
        <button type="button" className="td-ph-wide-btn">
          {t('assignment_detail_submit_on_moodle')}
        </button>
      </div>
    </Page>
  );
}
