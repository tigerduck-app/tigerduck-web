import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { animateTo, spring } from '../lib/springs';
import { Icon, type IconName } from './Icon';
import { Motion } from './Motion';

export function GlassButton({
  icon,
  label,
  onClick,
  text,
  buttonRef,
  expanded,
}: {
  icon?: IconName;
  label: string;
  onClick: () => void;
  /** Shows a word instead of an icon, as the bar's Done button. */
  text?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
  expanded?: boolean;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={text ? 'td-ph-glass td-ph-glass-btn td-ph-glass-btn--text' : 'td-ph-glass td-ph-glass-btn'}
      aria-label={text ? undefined : label}
      aria-expanded={expanded}
      onClick={onClick}
    >
      {text ?? (icon ? <Icon name={icon} /> : null)}
    </button>
  );
}

/** The app's sync status dot: green once the last sync worked, pulsing while one runs. */
export function SyncDot({ busy, label }: { busy: boolean; label: string }) {
  return (
    <span
      className={busy ? 'td-ph-sync-dot td-ph-sync-dot--busy' : 'td-ph-sync-dot'}
      role="img"
      aria-label={label}
    />
  );
}

/**
 * A segmented control. A hidden option, which must come after every shown one, folds away and grows
 * back the way the selection moves.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; hidden?: boolean }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const shown = options.filter((o) => !o.hidden).length;
  const position = useMotionValue(index);
  const count = useMotionValue(shown);
  const x = useTransform(position, (p) => `${p * 100}%`);
  const width = useTransform(count, (c) => `calc((100% - 6px) / ${c})`);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    animateTo(position, index, spring('smooth'));
    animateTo(count, shown, spring('smooth'));
  }, [index, shown, position, count]);
  return (
    <div className="td-ph-segmented" role="group" aria-label={label}>
      <Motion className="td-ph-segmented-thumb" style={{ width, x }} />
      {options.map((option, i) => (
        <Segment
          key={option.value}
          count={count}
          index={i}
          hidden={option.hidden ?? false}
          pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Segment>
      ))}
    </div>
  );
}

function Segment({
  count,
  index,
  hidden,
  pressed,
  onClick,
  children,
}: {
  count: MotionValue<number>;
  index: number;
  hidden: boolean;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const share = useTransform(count, (c) => Math.min(1, Math.max(0, c - index)));
  return (
    <Motion
      as="button"
      type="button"
      aria-pressed={pressed}
      aria-hidden={hidden || undefined}
      disabled={hidden}
      onClick={onClick}
      style={{ flexGrow: share, opacity: share }}
    >
      {children}
    </Motion>
  );
}

export function SectionTitle({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return (
    <h2 className="td-ph-section-title">
      <span>{children}</span>
      {trailing}
    </h2>
  );
}

/** One row of an inset grouped list. */
export function Row({
  icon,
  title,
  subtitle,
  value,
  onClick,
  chevron = onClick !== undefined,
  badge,
  destructive,
}: {
  icon?: IconName;
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  badge?: ReactNode;
  destructive?: boolean;
}) {
  const body = (
    <>
      {icon ? <Icon name={icon} className="td-ph-row-icon" /> : null}
      <span className="td-ph-row-main" style={destructive ? { color: 'var(--ph-red)' } : undefined}>
        <span>{title}</span>
        {subtitle ? <span className="td-ph-sub">{subtitle}</span> : null}
      </span>
      {badge}
      {value !== undefined ? <span className="td-ph-row-value">{value}</span> : null}
      {chevron ? <Icon name="chevron" className="td-ph-row-chevron" /> : null}
    </>
  );
  const style = icon ? ({ '--ph-sep-inset': '52px' } as React.CSSProperties) : undefined;
  return onClick ? (
    <button type="button" className="td-ph-row" style={style} onClick={onClick}>
      {body}
    </button>
  ) : (
    <div className="td-ph-row" style={style}>
      {body}
    </div>
  );
}

export function Group({ header, footer, children }: { header?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <div className="td-ph-section">
      {header ? <div className="td-ph-group-header">{header}</div> : null}
      <div className="td-ph-group">{children}</div>
      {footer ? <p className="td-ph-group-footer">{footer}</p> : null}
    </div>
  );
}

export function EmptyState({ icon, title, message }: { icon: IconName; title: string; message?: string }) {
  return (
    <div className="td-ph-empty">
      <Icon name={icon} />
      <span className={message ? 'td-ph-empty-title' : undefined}>{title}</span>
      {message ? <span>{message}</span> : null}
    </div>
  );
}

/** Demo HTML as `npm run sync-demo` writes it: allowed tags only, with no attribute, link target or image. */
export function DemoHtml({ html, className }: { html: string; className?: string }) {
  return <div className={className ? `td-ph-html ${className}` : 'td-ph-html'} dangerouslySetInnerHTML={{ __html: html }} />;
}
