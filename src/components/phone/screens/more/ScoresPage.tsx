import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { demo, text, type DemoRank } from '../../lib/demo';
import { k, usePhoneLocale, type Translate } from '../../lib/i18n';
import { currentTerm, termsBefore, type Term } from '../../lib/schedule';
import { Icon, type IconName } from '../../ui/Icon';
import { Page } from '../../ui/Page';
import { EmptyState, Segmented, SyncDot } from '../../ui/controls';
import { useRefresh } from '../useRefresh';

type Scope = 'semester' | 'cumulative';

interface ScoredTerm {
  code: string;
  term: Term;
  semester: DemoRank;
  cumulative: DemoRank;
  courses: { code: string; name: string; credits?: number; grade: string; status?: string }[];
}

const credits = (value: number) => String(Math.round(value * 100) / 100);

/** `%1$s 學年度 %2$s學期`, as the app's score screens write a term. */
function termTitle(term: Term, t: Translate): string {
  return t('score_academic_year_semester', term.year, termShort(term, t));
}

function termShort(term: Term, t: Translate): string {
  return t(term.semester === 1 ? k('score_semester_first_short') : k('score_semester_second_short'));
}

/** The app's ScoreColor and TigerDuckTheme.Tint, by a grade's letter. */
function gradeColor(grade: string): string {
  const letter = grade.trim().toUpperCase()[0];
  if (letter === 'A') return 'var(--ph-tint-green)';
  if (letter === 'B') return 'var(--ph-tint-blue)';
  if (letter === 'C') return 'var(--ph-tint-yellow)';
  if (letter === 'D' || letter === 'E' || letter === 'F') return 'var(--ph-tint-coral)';
  return 'var(--ph-text)';
}

const FAILED = new Set(['不通過', '未通過', 'FAIL', 'FAILED']);

/** The app's GradeChip: a letter grade in its colour, or a pass, a fail or a grade to come. */
function gradeChip(course: { grade: string; status?: string }, t: Translate): { label: string; color: string; passed?: boolean } {
  if (course.status === 'pending') return { label: t('score_grade_pending'), color: 'var(--ph-tint-grey)' };
  if (course.status === 'passed') {
    const passed = !FAILED.has(course.grade.trim().toUpperCase());
    return passed
      ? { label: t('score_grade_passed'), color: 'var(--ph-tint-teal)', passed }
      : { label: t('score_grade_failed'), color: 'var(--ph-tint-red)', passed };
  }
  return { label: course.grade, color: gradeColor(course.grade) };
}

/** The app's ScoreView: the student, credits, the GPA trend and each term's courses, newest first. */
export function ScoresPage() {
  const { t, locale } = usePhoneLocale();
  const { busy, refresh } = useRefresh();
  const now = Date.now();
  const current = currentTerm(now);
  const terms = useMemo(
    () =>
      (demo.scores?.terms ?? [])
        .map((term): ScoredTerm => {
          const placed = termsBefore(current, term.termsAgo);
          return {
            code: `${placed.year}${placed.semester}`,
            term: placed,
            semester: term.semester ?? {},
            cumulative: term.cumulative ?? term.semester ?? {},
            courses: (term.courses ?? []).map((course) => ({ ...course, name: text(course.name, locale) })),
          };
        })
        .sort((a, b) => b.code.localeCompare(a.code)),
    [current.year, current.semester, locale]
  );
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set(terms.slice(1).map((term) => term.code)));
  const earned = terms.flatMap((term) => term.courses).reduce((sum, course) => sum + (course.credits ?? 0), 0);
  const enrolled = (demo.courses ?? []).reduce((sum, course) => sum + (course.credits ?? 0), 0);

  return (
    <Page title={t('feature_score')} onRefresh={refresh} trailing={<SyncDot busy={busy} label={t('feature_score')} />}>
      {terms.length ? (
        <div className="td-ph-scores">
          <div className="td-ph-card td-ph-score-student">
            <span className="td-ph-score-cap">
              <Icon name="graduation" />
            </span>
            <span className="td-ph-row-main">
              <strong>{text(demo.scores?.student, locale) || t('feature_score')}</strong>
              <span className="td-ph-caption">{termTitle(current, t)}</span>
            </span>
          </div>
          <div className="td-ph-score-credits">
            <CreditTile label={t('score_credit_earned')} value={earned} color="var(--ph-tint-green)" />
            <CreditTile label={t('score_credit_enrolled')} value={enrolled} color="var(--ph-tint-cyan)" />
          </div>
          <TrendCard terms={[...terms].reverse()} />
          {terms.map((term) => (
            <TermSection
              key={term.code}
              term={term}
              collapsed={collapsed.has(term.code)}
              onToggle={() =>
                setCollapsed((set) => {
                  const next = new Set(set);
                  if (!next.delete(term.code)) next.add(term.code);
                  return next;
                })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState icon="chartLine" title={t('score_empty_title')} />
      )}
    </Page>
  );
}

function CreditTile({ label, value, color }: { label: string; value: number; color: string }) {
  const { t } = usePhoneLocale();
  return (
    <div className="td-ph-card td-ph-score-tile">
      <span className="td-ph-caption">{label}</span>
      <span className="td-ph-score-tile-value">
        <b style={{ color }}>{credits(value)}</b>
        <small>{t('course_detail_credits_label')}</small>
      </span>
    </div>
  );
}

const CHART_HEIGHT = 160;
const AXIS_WIDTH = 30;
const LABEL_HEIGHT = 18;

/** Swift Charts' automatic marks: a round step that gives three to five lines, with its labels. */
function ticks(low: number, high: number): { value: number; label: string }[] {
  const step = [0.1, 0.2, 0.25, 0.5, 1].find((s) => (high - low) / s <= 5) ?? 1;
  const digits = step === 0.25 ? 2 : step < 1 ? 1 : 0;
  const out: { value: number; label: string }[] = [];
  for (let i = Math.ceil(low / step - 1e-9); i * step <= high + 1e-9; i++) {
    out.push({ value: i * step, label: (i * step).toFixed(digits) });
  }
  return out;
}

/** A monotone cubic through the points, as Swift Charts' `.monotone` interpolation. */
function monotonePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return points.length ? `M${points[0].x},${points[0].y}` : '';
  const n = points.length;
  const slopes = points.slice(1).map((p, i) => (p.y - points[i].y) / (p.x - points[i].x));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === n - 1) return slopes[n - 2];
    const [a, b] = [slopes[i - 1], slopes[i]];
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (points[i + 1].x - points[i].x) / 3;
    d += `C${points[i].x + dx},${points[i].y + tangents[i] * dx} ${points[i + 1].x - dx},${points[i + 1].y - tangents[i + 1] * dx} ${points[i + 1].x},${points[i + 1].y}`;
  }
  return d;
}

/** The app's RankingsTrendCard and GPATrendChart, oldest term first. */
function TrendCard({ terms }: { terms: ScoredTerm[] }) {
  const { t } = usePhoneLocale();
  const [scope, setScope] = useState<Scope>('semester');
  const [picked, setPicked] = useState<string | null>(null);
  const [width, setWidth] = useState(300);
  const plot = useRef<SVGSVGElement>(null);
  const points = terms.filter((term) => term[scope].gpa !== undefined);
  const selected = points.find((p) => p.code === picked) ?? points[points.length - 1];
  const values = points.map((p) => p[scope].gpa!);
  const low = values.length ? Math.max(0, Math.min(...values) - 0.3) : 0;
  const high = values.length ? Math.min(4.3, Math.max(...values) + 0.3) : 4.3;
  const band = (width - AXIS_WIDTH) / Math.max(1, points.length);
  const xOf = (i: number) => AXIS_WIDTH + band * (i + 0.5);
  const plotHeight = CHART_HEIGHT - LABEL_HEIGHT;
  const yOf = (v: number) => plotHeight - ((v - low) / (high - low || 1)) * plotHeight;
  const coords = points.map((p, i) => ({ x: xOf(i), y: yOf(p[scope].gpa!) }));

  useLayoutEffect(() => {
    if (plot.current) setWidth(plot.current.clientWidth);
  }, []);

  // Index math over the plot's width, as the app's selectTerm, so a drag anywhere picks a term.
  const pick = (clientX: number) => {
    const box = plot.current?.getBoundingClientRect();
    if (!box || !points.length) return;
    const x = ((clientX - box.left) / box.width) * width;
    const ratio = Math.min(1, Math.max(0, (x - AXIS_WIDTH) / (width - AXIS_WIDTH)));
    setPicked(points[Math.round(ratio * (points.length - 1))].code);
  };
  const rank = selected?.[scope];

  return (
    <div className="td-ph-card td-ph-score-trend">
      <div className="td-ph-score-trend-head">
        <strong>{t('score_gpa_trend_title')}</strong>
        <div className="td-ph-score-scope">
          <Segmented
            label={t('score_gpa_trend_title')}
            value={scope}
            onChange={setScope}
            options={[
              { value: 'semester', label: t('score_scope_semester') },
              { value: 'cumulative', label: t('score_scope_cumulative') },
            ]}
          />
        </div>
      </div>
      {points.length ? (
        <>
          <svg
            ref={plot}
            className="td-ph-score-chart"
            height={CHART_HEIGHT}
            role="slider"
            tabIndex={0}
            aria-label={t('a11y_rankings_trend_chart')}
            aria-valuemin={0}
            aria-valuemax={points.length - 1}
            aria-valuenow={points.indexOf(selected)}
            aria-valuetext={t('a11y_rankings_trend_point', selected.code, selected[scope].gpa!.toFixed(2))}
            onKeyDown={(event) => {
              const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[event.key];
              if (!step) return;
              event.preventDefault();
              const next = points[Math.min(points.length - 1, Math.max(0, points.indexOf(selected) + step))];
              setPicked(next.code);
            }}
            onPointerDown={(event) => pick(event.clientX)}
            onPointerMove={(event) => {
              if (event.buttons) pick(event.clientX);
            }}
          >
            {ticks(low, high).map((tick) => (
              <g key={tick.label}>
                <line x1={AXIS_WIDTH} x2={width} y1={yOf(tick.value)} y2={yOf(tick.value)} className="td-ph-score-grid" />
                <text x={AXIS_WIDTH - 6} y={yOf(tick.value) + 4} textAnchor="end" className="td-ph-score-axis">
                  {tick.label}
                </text>
              </g>
            ))}
            {points.map((p, i) => (
              <text key={p.code} x={xOf(i)} y={CHART_HEIGHT - 3} textAnchor="middle" className="td-ph-score-axis">
                {p.code}
              </text>
            ))}
            {selected ? (
              <line
                x1={xOf(points.indexOf(selected))}
                x2={xOf(points.indexOf(selected))}
                y1={0}
                y2={plotHeight}
                className="td-ph-score-rule"
              />
            ) : null}
            <path d={monotonePath(coords)} className="td-ph-score-line" />
            {coords.map((c, i) => (
              <circle key={points[i].code} cx={c.x} cy={c.y} r={points[i].code === picked ? 7 : 4.5} className="td-ph-score-dot" />
            ))}
            {selected ? (
              <circle
                cx={xOf(points.indexOf(selected))}
                cy={yOf(selected[scope].gpa!)}
                r={4.4}
                className="td-ph-score-picked"
              />
            ) : null}
          </svg>
          <div className="td-ph-score-summary">
            <Cell
              title={
                picked ? t('score_gpa_term_label', `${selected.term.year}-${termShort(selected.term, t)}`) : t('score_gpa_latest')
              }
              value={rank?.gpa?.toFixed(2) ?? '—'}
            />
            <Cell title={t('score_rank_class')} value={rank?.classRank?.toString() ?? '—'} />
            <Cell title={t('score_ranking_dept_label')} value={rank?.deptRank?.toString() ?? '—'} />
          </div>
        </>
      ) : (
        <p className="td-ph-caption td-ph-score-none">{t('score_no_ranking_data')}</p>
      )}
    </div>
  );
}

function Cell({ title, value }: { title: string; value: string }) {
  return (
    <span className="td-ph-score-cell">
      <small>{title}</small>
      <b>{value}</b>
    </span>
  );
}

/** The app's SemesterSection: a term's header, which folds its course rows away. */
function TermSection({ term, collapsed, onToggle }: { term: ScoredTerm; collapsed: boolean; onToggle: () => void }) {
  const { t } = usePhoneLocale();
  const total = term.courses.reduce((sum, course) => sum + (course.credits ?? 0), 0);
  const { gpa, classRank, deptRank } = term.semester;
  const pills: [IconName, string][] = [['hash', t('score_course_credits', credits(total))]];
  if (gpa !== undefined) pills.push(['chartLine', `GPA ${gpa.toFixed(2)}`]);
  if (classRank !== undefined && deptRank !== undefined) {
    pills.push(['people', t('score_semester_ranking', String(deptRank), String(classRank))]);
  }
  return (
    <div className="td-ph-card td-ph-score-term">
      <button type="button" className="td-ph-score-term-head" aria-expanded={!collapsed} onClick={onToggle}>
        <span className="td-ph-row-main">
          <strong>{termTitle(term.term, t)}</strong>
          <span className="td-ph-score-pills">
            {pills.map(([icon, label]) => (
              <span key={icon}>
                <Icon name={icon} />
                {label}
              </span>
            ))}
          </span>
        </span>
        <Icon name="chevronDown" className={collapsed ? 'td-ph-score-fold' : 'td-ph-score-fold td-ph-score-fold--open'} />
      </button>
      {collapsed ? null : (
        <div className="td-ph-score-courses">
          {term.courses.map((course) => (
            <div key={course.code} className="td-ph-score-course">
              <span className="td-ph-row-main">
                <b>{course.name}</b>
                <span className="td-ph-caption">
                  <code>{course.code}</code> · {course.credits !== undefined ? t('score_course_credits', credits(course.credits)) : '—'}
                </span>
              </span>
              <GradeChip course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GradeChip({ course }: { course: { grade: string; status?: string } }) {
  const { t } = usePhoneLocale();
  const chip = gradeChip(course, t);
  return (
    <span className="td-ph-score-grade" style={{ '--grade': chip.color } as CSSProperties}>
      {chip.passed !== undefined ? <Icon name={chip.passed ? 'check' : 'close'} /> : null}
      {chip.label}
    </span>
  );
}
