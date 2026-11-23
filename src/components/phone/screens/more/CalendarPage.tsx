import { useMemo, useRef, useState } from 'react';
import { useMotionValue } from 'motion/react';
import { demo, demoTime } from '../../lib/demo';
import { phoneScale, usePan } from '../../lib/gesture';
import { k, usePhoneLocale } from '../../lib/i18n';
import { animateTo, spring } from '../../lib/springs';
import { DAY_MS, hhmm, startOfTaipeiDay, taipei, useNow } from '../../lib/time';
import { Icon } from '../../ui/Icon';
import { Motion } from '../../ui/Motion';
import { Page } from '../../ui/Page';
import { assignmentItems } from '../assignments';

interface DayEvent {
  title: string;
  day: number;
  time?: number;
  sourceKey: string;
  color: string;
}

const SOURCES: Record<string, { key: string; color: string }> = {
  exam: { key: k('calendar_source_exam'), color: 'var(--ph-red)' },
  holiday: { key: k('calendar_source_holiday'), color: 'var(--ph-green)' },
  semester: { key: k('calendar_source_semester'), color: 'var(--ph-orange)' },
  school: { key: k('calendar_source_school'), color: 'var(--ph-orange)' },
  moodle: { key: k('calendar_source_moodle'), color: 'var(--ph-accent)' },
};

/** Days of the month as the grid draws them, Sunday first, padded to whole weeks. */
function monthCells(year: number, month: number): (number | null)[] {
  const first = Date.UTC(year, month - 1, 1) - 8 * 3600_000;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = taipei(first).weekday % 7;
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 0; d < days; d++) cells.push(first + d * DAY_MS);
  while (cells.length % 7) cells.push(null);
  return cells;
}

const WEEK_KEYS = [
  k('weekday_sun_short'),
  k('weekday_mon_short'),
  k('weekday_tue_short'),
  k('weekday_wed_short'),
  k('weekday_thu_short'),
  k('weekday_fri_short'),
  k('weekday_sat_short'),
];

export function CalendarPage() {
  const now = useNow();
  const { t, locale } = usePhoneLocale();
  const today = startOfTaipeiDay(now);
  const [month, setMonth] = useState(() => ({ year: taipei(now).year, month: taipei(now).month }));
  const [selected, setSelected] = useState(today);
  const gridRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const events = useMemo<DayEvent[]>(() => {
    const school = (demo.calendar ?? []).flatMap((entry) => {
      const time = demoTime(entry.date);
      const source = SOURCES[entry.source ?? 'school'] ?? SOURCES.school;
      return time === null ? [] : [{ title: entry.title, day: startOfTaipeiDay(time), sourceKey: source.key, color: source.color }];
    });
    const deadlines = assignmentItems(locale).map((a) => ({
      title: a.title,
      day: startOfTaipeiDay(a.due),
      time: a.due,
      sourceKey: SOURCES.moodle.key,
      color: SOURCES.moodle.color,
    }));
    return [...school, ...deadlines];
  }, [locale]);

  const shift = (delta: number) => {
    const index = month.year * 12 + month.month - 1 + delta;
    setMonth({ year: Math.floor(index / 12), month: (index % 12) + 1 });
  };

  usePan(gridRef, {
    axis: 'x',
    onStart: () => x.stop(),
    onMove: (info) => x.set(info.dx / phoneScale(gridRef.current!)),
    onEnd: (info) => {
      const width = gridRef.current!.offsetWidth;
      const velocity = info.vx / phoneScale(gridRef.current!);
      const turn = Math.abs(x.get()) > width / 4 || Math.abs(velocity) > 500 ? -Math.sign(x.get() || -velocity) : 0;
      if (!turn) {
        animateTo(x, 0, spring('smooth'));
        return;
      }
      animateTo(x, turn * -width, { ...spring('smooth'), velocity }).then(() => {
        shift(turn);
        x.set(turn * width);
        animateTo(x, 0, spring('smooth'));
      });
    },
  });

  const dayEvents = events.filter((e) => e.day === selected);
  const cells = monthCells(month.year, month.month);

  return (
    <Page title={t('feature_calendar')} titleMode="row">
      <div className="td-ph-card td-ph-cal">
        <div className="td-ph-cal-head">
          <b>{t('calendar_month_year', month.year, month.month)}</b>
          <span className="td-ph-bar-spacer" />
          <button type="button" aria-label={t('a11y_calendar_nav_prev')} onClick={() => shift(-1)}>
            <Icon name="back" />
          </button>
          <button type="button" aria-label={t('a11y_calendar_nav_next')} onClick={() => shift(1)}>
            <Icon name="chevron" />
          </button>
        </div>
        <div className="td-ph-cal-week" aria-hidden="true">
          {WEEK_KEYS.map((key) => (
            <span key={key}>{t(key)}</span>
          ))}
        </div>
        <div ref={gridRef} className="td-ph-cal-clip">
          <Motion className="td-ph-cal-grid" style={{ x }}>
            {cells.map((day, i) =>
              day === null ? (
                <span key={`e${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  className={[
                    'td-ph-cal-day',
                    day === today ? 'td-ph-cal-day--today' : '',
                    day === selected ? 'td-ph-cal-day--selected' : '',
                  ].join(' ')}
                  aria-pressed={day === selected}
                  onClick={() => setSelected(day)}
                >
                  {taipei(day).day}
                  <span className="td-ph-cal-dots">
                    {events
                      .filter((e) => e.day === day)
                      .slice(0, 3)
                      .map((e, j) => (
                        <i key={j} style={{ background: e.color }} />
                      ))}
                  </span>
                </button>
              )
            )}
          </Motion>
        </div>
      </div>
      <div className="td-ph-section">
        <h2 className="td-ph-section-title">
          {selected === today ? t('calendar_today') : `${taipei(selected).month}/${taipei(selected).day}`}
        </h2>
        {dayEvents.length ? (
          <div className="td-ph-card td-ph-rows">
            {dayEvents.map((e, i) => (
              <div key={i} className="td-ph-row">
                <span className="td-ph-cal-mark" style={{ background: e.color }} />
                <span className="td-ph-row-main">
                  <span>{e.title}</span>
                  <span className="td-ph-caption">
                    {t(e.sourceKey)}
                    {e.time !== undefined ? ` · ${hhmm(e.time)}` : ''}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="td-ph-group-footer">
            {selected === today ? t('calendar_no_events_today') : t('calendar_no_events_on_day')}
          </p>
        )}
      </div>
    </Page>
  );
}
