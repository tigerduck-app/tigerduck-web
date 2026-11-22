import type { ClubOccurrence } from '../../lib/clubs';
import { usePhoneLocale } from '../../lib/i18n';
import { hhmm } from '../../lib/time';
import { Page } from '../../ui/Page';
import { Fact, InfoRow } from './CourseSheet';

/** The app's ClubActivityDetailSheet. */
export function ClubSheet({ club }: { club: ClubOccurrence }) {
  const { t } = usePhoneLocale();
  // The app's ClubActivityKind, a meeting when the feed names none.
  const type =
    club.type === undefined || club.type === '社課或會議'
      ? t('class_table_club_activity_type_meeting')
      : club.type === '活動'
        ? t('class_table_club_activity_type_event')
        : club.type;
  return (
    <Page title={club.clubName}>
      <div className="td-ph-course-bar" style={{ background: club.color }} />
      {club.name ? <p className="td-ph-sheet-subtitle">{club.name}</p> : null}
      <div className="td-ph-course-facts">
        <Fact label={t('class_table_club_location_label')} value={club.location || '—'} />
        <Fact label={t('class_table_club_time_label')} value={`${hhmm(club.start)} - ${hhmm(club.end)}`} />
      </div>
      <dl className="td-ph-course-rows">
        <InfoRow label={t('class_table_club_activity_type_label')}>{type}</InfoRow>
      </dl>
      {club.content ? (
        <>
          <hr className="td-ph-divider" />
          <p className="td-ph-club-content">{club.content}</p>
        </>
      ) : null}
    </Page>
  );
}
