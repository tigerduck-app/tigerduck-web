import { ICONS, type IconName } from './icons';

export type { IconName };

/** A decorative icon; the control around it carries the accessible name. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={className ? `td-ph-icon ${className}` : 'td-ph-icon'}
      aria-hidden="true"
      // Static SVG files from @phosphor-icons/core, bundled at build time.
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
