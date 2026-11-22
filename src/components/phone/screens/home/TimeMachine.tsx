import { useMemo, useRef, useState } from 'react';
import { JSAnimation } from 'motion/react';
import { demo } from '../../lib/demo';
import { phoneScale, usePan } from '../../lib/gesture';
import { usePhoneLocale } from '../../lib/i18n';
import { meetingsAround, tint, type Meeting } from '../../lib/schedule';
import { spring } from '../../lib/springs';
import { hhmm, monthDay, monthDayTime, startOfTaipeiDay, taipei } from '../../lib/time';
import { POINTS_PER_MINUTE, timeFor, timelineAnchors, xFor } from '../../lib/timeline';
import { Icon } from '../../ui/Icon';
import { SectionTitle } from '../../ui/controls';

const TRACK_WIDTH = 370;
const TICK_MS = 15 * 60_000;
const KEY_STEP_MS = 15 * 60_000;

type CardState =
  | { kind: 'in'; meetings: Meeting[] }
  | { kind: 'between'; prev: Meeting; next: Meeting }
  | { kind: 'before'; next: Meeting }
  | { kind: 'after'; prev: Meeting };

function stateAt(meetings: Meeting[], at: number): CardState | null {
  if (!meetings.length) return null;
  const current = meetings.filter((m) => m.start <= at && at < m.end);
  if (current.length) return { kind: 'in', meetings: current };
  const next = meetings.find((m) => m.start > at);
  const prev = [...meetings].reverse().find((m) => m.end <= at);
  if (prev && next) return { kind: 'between', prev, next };
  return next ? { kind: 'before', next } : { kind: 'after', prev: prev! };
}

/** Home's time machine: the class at a moment, and a track to drag through the week. */
export function TimeMachine({ now, onOpen }: { now: number; onOpen: (meeting: Meeting) => void }) {
  const { t, locale } = usePhoneLocale();
  const meetings = useMemo(() => meetingsAround(demo.courses ?? [], now, locale), [now, locale]);
  const anchors = useMemo(() => timelineAnchors(meetings), [meetings]);
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? now;
  const trackRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef(0);

  usePan(trackRef, {
    axis: 'x',
    onStart: () => {
      dragFrom.current = xFor(anchors, selected);
    },
    onMove: (info) => {
      const x = dragFrom.current - info.dx / phoneScale(trackRef.current!);
      setPicked(timeFor(anchors, x, selected));
    },
    onEnd: () => {},
  });

  const returnToNow = () => {
    const from = selected;
    new JSAnimation({
      keyframes: [0, 1],
      ...spring('smooth'),
      onUpdate: (p: number) => setPicked(from + (Date.now() - from) * p),
      onComplete: () => setPicked(null),
    });
  };

  const state = stateAt(meetings, selected);
  const center = TRACK_WIDTH / 2;
  const offset = (time: number) => center + xFor(anchors, time) - xFor(anchors, selected);
  const visibleMs = (TRACK_WIDTH / POINTS_PER_MINUTE) * 60_000;
  const ticks: { time: number; x: number; major: boolean }[] = [];
  for (let time = Math.floor((selected - visibleMs) / TICK_MS) * TICK_MS; time <= selected + visibleMs; time += TICK_MS) {
    const x = offset(time);
    if (x > -10 && x < TRACK_WIDTH + 10) ticks.push({ time, x, major: taipei(time).minute === 0 });
  }
  const active = state?.kind === 'in' ? state.meetings[0] : null;
  const timeLabel = startOfTaipeiDay(selected) === startOfTaipeiDay(now) ? hhmm(selected) : monthDayTime(selected);

  return (
    <section className="td-ph-section">
      <SectionTitle
        trailing={
          picked !== null ? (
            <button type="button" className="td-ph-tm-now td-ph-glass" onClick={returnToNow}>
              {t('home_time_slider_now')}
            </button>
          ) : null
        }
      >
        {t('home_time_slider_title')}
      </SectionTitle>
      {state ? (
        <div className="td-ph-tm">
          <div className="td-ph-tm-cards">
            {state.kind === 'in'
              ? state.meetings.map((m) => <CourseCard key={m.id} meeting={m} now={now} dim={false} onOpen={onOpen} />)
              : null}
            {state.kind === 'between' ? (
              <>
                <CourseCard meeting={state.prev} now={now} dim onOpen={onOpen} />
                <CourseCard meeting={state.next} now={now} dim onOpen={onOpen} />
              </>
            ) : null}
            {state.kind === 'before' ? <CourseCard meeting={state.next} now={now} dim onOpen={onOpen} /> : null}
            {state.kind === 'after' ? <CourseCard meeting={state.prev} now={now} dim onOpen={onOpen} /> : null}
          </div>
          <div className="td-ph-tm-time" aria-hidden="true">
            {timeLabel}
          </div>
          <div
            ref={trackRef}
            className="td-ph-tm-track td-ph-glass"
            role="slider"
            tabIndex={0}
            aria-label={t('home_time_slider_title')}
            aria-valuemin={anchors[0]?.t}
            aria-valuemax={anchors[anchors.length - 1]?.t}
            aria-valuenow={selected}
            aria-valuetext={timeLabel}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              setPicked(selected + (event.key === 'ArrowRight' ? KEY_STEP_MS : -KEY_STEP_MS));
            }}
          >
            {ticks.map((tick) => (
              <span
                key={tick.time}
                className={tick.major ? 'td-ph-tm-tick td-ph-tm-tick--major' : 'td-ph-tm-tick'}
                style={{ left: tick.x }}
              />
            ))}
            {meetings.map((m) => {
              const left = offset(m.start);
              const width = Math.max(28, offset(m.end) - left);
              if (left > TRACK_WIDTH + 50 || left + width < -50) return null;
              const on = m.start <= selected && selected < m.end;
              return (
                <span
                  key={m.id}
                  className="td-ph-tm-seg"
                  style={{ left, width, background: tint(m.color, on ? 0.5 : 0.3) }}
                />
              );
            })}
            <span className="td-ph-tm-thumb" />
            <span
              className="td-ph-tm-glow"
              style={{ background: active?.color ?? 'var(--ph-text)', boxShadow: `0 0 12px ${active?.color ?? 'transparent'}` }}
            />
          </div>
        </div>
      ) : (
        <div className="td-ph-empty">
          <Icon name="checkCircle" />
          <span>{t('home_time_slider_no_courses')}</span>
        </div>
      )}
    </section>
  );
}

function CourseCard({
  meeting,
  now,
  dim,
  onOpen,
}: {
  meeting: Meeting;
  now: number;
  dim: boolean;
  onOpen: (meeting: Meeting) => void;
}) {
  const subtitle = [meeting.room, meeting.instructor].filter(Boolean).join(' · ');
  const otherDay = startOfTaipeiDay(meeting.start) !== startOfTaipeiDay(now);
  return (
    <button
      type="button"
      className="td-ph-tm-card"
      style={{ background: tint(meeting.color, 0.6), opacity: dim ? 0.5 : 1 }}
      onClick={() => onOpen(meeting)}
    >
      <span className="td-ph-tm-card-top">
        <b>
          {hhmm(meeting.start)} - {hhmm(meeting.end)}
        </b>
        {otherDay ? <small>{monthDay(meeting.start)}</small> : null}
      </span>
      <strong>{meeting.title}</strong>
      <span className="td-ph-tm-card-sub">{subtitle}</span>
    </button>
  );
}
