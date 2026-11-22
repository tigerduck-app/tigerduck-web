import { useState } from 'react';
import { demo, text } from '../../lib/demo';
import { k, usePhoneLocale } from '../../lib/i18n';
import { PERIODS } from '../../lib/schedule';
import { minutesOf, taipei } from '../../lib/time';
import { Page } from '../../ui/Page';
import { EmptyState } from '../../ui/controls';

const BUILDING_KEYS: Record<string, string> = {
  AD: k('empty_classroom_building_ad'),
  AU: k('empty_classroom_building_au'),
  E1: k('empty_classroom_building_e1'),
  E2: k('empty_classroom_building_e2'),
  EE: k('empty_classroom_building_ee'),
  IA: k('empty_classroom_building_ia'),
  IB: k('empty_classroom_building_ib'),
  LB: k('empty_classroom_building_lb'),
  MA: k('empty_classroom_building_ma'),
  RB: k('empty_classroom_building_rb'),
  T1: k('empty_classroom_building_t1'),
  T2: k('empty_classroom_building_t2'),
  T3: k('empty_classroom_building_t3'),
  T4: k('empty_classroom_building_t4'),
  TR: k('empty_classroom_building_tr'),
};

/** The period on now, or the next one today, or the first. */
function currentPeriod(now: number): number {
  const { hour, minute } = taipei(now);
  const at = hour * 60 + minute;
  const index = PERIODS.findIndex((p) => at <= minutesOf(p.end));
  return index < 0 ? 0 : index;
}

export function EmptyClassroomPage({ now }: { now: number }) {
  const { t, locale } = usePhoneLocale();
  const data = demo.emptyClassroom;
  const buildings = Object.keys(data?.buildings ?? {});
  const [building, setBuilding] = useState(buildings[0] ?? '');
  const [period, setPeriod] = useState(() => currentPeriod(now));
  const weekday = String(taipei(now).weekday);
  const rooms = Object.entries(data?.rooms ?? {})
    .filter(([room]) => room.startsWith(`${building}-`))
    .map(([room, days]) => {
      const mark = (days[weekday] ?? days['*'] ?? '')[period] ?? '.';
      const course = /\d/.test(mark) ? data?.classes?.[Number(mark) - 1] : undefined;
      return { room, mark, course };
    })
    .sort((a, b) => Number(a.mark !== '.') - Number(b.mark !== '.') || a.room.localeCompare(b.room));

  return (
    <Page title={t('feature_empty_classroom')}>
      {buildings.length ? (
        <>
          <div className="td-ph-chips" role="group" aria-label={t('feature_empty_classroom')}>
            {buildings.map((code) => (
              <button
                key={code}
                type="button"
                className={building === code ? 'td-ph-chip' : 'td-ph-chip td-ph-glass'}
                aria-pressed={building === code}
                onClick={() => setBuilding(code)}
              >
                {BUILDING_KEYS[code] ? t(BUILDING_KEYS[code]) : data?.buildings?.[code] ?? code}
              </button>
            ))}
          </div>
          <div className="td-ph-chips td-ph-period-chips" role="group" aria-label={t('course_detail_time_label')}>
            {PERIODS.map((p, index) => (
              <button
                key={p.id}
                type="button"
                className={period === index ? 'td-ph-chip' : 'td-ph-chip td-ph-glass'}
                aria-pressed={period === index}
                onClick={() => setPeriod(index)}
              >
                <b>{p.id}</b>
                <small>{p.start}</small>
              </button>
            ))}
          </div>
          <div className="td-ph-card td-ph-rows" style={{ marginTop: 8 }}>
            {rooms.map(({ room, mark, course }) => (
              <div key={room} className="td-ph-row">
                <span className="td-ph-row-main">
                  <span>{room}</span>
                  {course ? (
                    <span className="td-ph-sub">
                      {text(course.name, locale)}
                      {course.teacher ? ` · ${text(course.teacher, locale)}` : ''}
                    </span>
                  ) : null}
                </span>
                {mark === '.' ? (
                  <span className="td-ph-status td-ph-status--free">{t('empty_classroom_free')}</span>
                ) : mark === 'b' ? (
                  <span className="td-ph-status">{t('empty_classroom_booked')}</span>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState icon="buildings" title={t('empty_classroom_no_data')} />
      )}
    </Page>
  );
}
