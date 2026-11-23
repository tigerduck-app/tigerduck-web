import { useEffect, useRef, useState } from 'react';
import { demo } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { useMenu } from '../../ui/Menu';
import { Page } from '../../ui/Page';
import { EmptyState, GlassButton, SyncDot } from '../../ui/controls';
import { useRefresh } from '../useRefresh';

/** The library's pass changes every 30 seconds; the demo counts down over the same code. */
const CYCLE_S = 30;

function QrCode({ modules, label }: { modules: string[]; label: string }) {
  const size = modules.length;
  let path = '';
  modules.forEach((row, y) => {
    for (let x = 0; x < size; x++) if (row[x] === '1') path += `M${x} ${y}h1v1h-1z`;
  });
  return (
    <svg className="td-ph-qr" viewBox={`-2 -2 ${size + 4} ${size + 4}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={size + 4} height={size + 4} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
}

export function LibraryScreen() {
  const { t } = usePhoneLocale();
  const openMenu = useMenu();
  const menuButton = useRef<HTMLButtonElement>(null);
  const { busy, refresh } = useRefresh();
  const [left, setLeft] = useState(CYCLE_S);
  const [flip, setFlip] = useState(true);
  const modules = demo.libraryQr?.modules;

  useEffect(() => {
    const timer = window.setInterval(() => setLeft((s) => (s <= 1 ? CYCLE_S : s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Page
      title={t('feature_library')}
      titleMode="bar"
      onRefresh={async () => {
        await refresh();
        setLeft(CYCLE_S);
      }}
      trailing={
        <>
          <SyncDot busy={busy} label={t('library_status_signed_in')} />
          <GlassButton
            icon="dots"
            label={t('feature_library')}
            buttonRef={menuButton}
            onClick={() =>
              openMenu(menuButton.current!, [
                { label: t('settings_library_flip_to_show_qr'), checked: flip, onSelect: () => setFlip((f) => !f) },
                'divider',
                { label: t('settings_library_sign_out'), destructive: true, onSelect: () => {} },
              ])
            }
          />
        </>
      }
    >
      {modules ? (
        <div className="td-ph-section">
          <div className="td-ph-card td-ph-library">
            <div className="td-ph-library-head">
              <b>{t('library_virtual_pass_title')}</b>
              <span aria-hidden="true">|</span>
              <b>{demo.studentId}</b>
            </div>
            <QrCode modules={modules} label={t('library_qr_content_description')} />
            <div className="td-ph-library-countdown">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="9" r="7" fill="none" stroke="var(--ph-fill-2)" strokeWidth="2.5" />
                <circle
                  cx="9"
                  cy="9"
                  r="7"
                  fill="none"
                  stroke="var(--ph-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(left / CYCLE_S) * 44} 44`}
                  transform="rotate(-90 9 9)"
                  style={{ transition: left === CYCLE_S ? 'none' : 'stroke-dasharray 1s linear' }}
                />
              </svg>
              <span>{t('library_qr_refresh_in_seconds', left)}</span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon="qr" title={t('library_qr_not_generated')} />
      )}
    </Page>
  );
}
