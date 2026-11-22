import { clubColor, setSubscribed, useSubscribedClubs } from '../../lib/clubs';
import { demo, text, type DemoClub } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { Icon } from '../../ui/Icon';
import { Page } from '../../ui/Page';
import { SwipeRow } from '../../ui/SwipeRow';
import { Group } from '../../ui/controls';

/** The app's ClubSubscribeSheet: the subscribed clubs in their order, then every club. */
export function ClubsSheet() {
  const { t } = usePhoneLocale();
  const subscribed = useSubscribedClubs();
  const clubs = demo.clubs ?? [];
  const shown = subscribed.flatMap((id) => clubs.filter((club) => club.id === id));
  return (
    <Page title={t('class_table_subscribe_clubs')}>
      {shown.length ? (
        <Group header={t('class_table_club_section_subscribed')}>
          {shown.map((club) => (
            <SwipeRow
              key={club.id}
              trailing={[
                {
                  label: t('class_table_club_unsubscribe_action'),
                  icon: 'minusCircle',
                  color: 'var(--ph-red)',
                  removes: true,
                  onTrigger: () => setSubscribed(club.id, false),
                },
              ]}
            >
              <div className="td-ph-row td-ph-club-row" style={{ "--ph-sep-inset": "52px" } as React.CSSProperties}>
                <span className="td-ph-club-swatch" style={{ background: clubColor(club.id) }} />
                <ClubName club={club} />
              </div>
            </SwipeRow>
          ))}
        </Group>
      ) : null}
      <Group header={t('class_table_club_section_all')}>
        {clubs.map((club) => {
          const on = subscribed.includes(club.id);
          return (
            <button
              key={club.id}
              type="button"
              className="td-ph-row td-ph-club-row"
              aria-pressed={on}
              onClick={() => setSubscribed(club.id, !on)}
            >
              <ClubName club={club} />
              <Icon name={on ? 'checkCircle' : 'plusCircle'} className="td-ph-club-mark" />
            </button>
          );
        })}
      </Group>
    </Page>
  );
}

function ClubName({ club }: { club: DemoClub }) {
  const { locale } = usePhoneLocale();
  const tagline = text(club.tagline ?? undefined, locale);
  return (
    <span className="td-ph-row-main">
      <span>{text(club.name, locale)}</span>
      {tagline ? <span className="td-ph-sub">{tagline}</span> : null}
    </span>
  );
}
