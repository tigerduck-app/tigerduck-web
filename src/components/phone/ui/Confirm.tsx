import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { usePhoneLocale } from '../lib/i18n';

export interface ConfirmRequest {
  title: string;
  message: string;
  /** The destructive button's label. */
  action: string;
  onConfirm: () => void;
}

type Confirm = (request: ConfirmRequest) => void;

const ConfirmContext = createContext<Confirm>(() => {});

export function useConfirm(): Confirm {
  return useContext(ConfirmContext);
}

/** SwiftUI's `confirmationDialog` on iPhone: an action sheet over a dimmed screen, with Cancel apart. */
export function ConfirmHost({ children }: { children: ReactNode }) {
  const { t } = usePhoneLocale();
  const [request, setRequest] = useState<(ConfirmRequest & { returnFocus: Element | null }) | null>(null);
  const [closing, setClosing] = useState(false);
  const confirmed = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const id = useId();

  const ask = useCallback<Confirm>((next) => {
    confirmed.current = false;
    setClosing(false);
    setRequest({ ...next, returnFocus: document.activeElement });
  }, []);

  const close = (confirm: boolean) => {
    confirmed.current = confirm;
    setClosing(true);
  };

  // The sheet slides away in CSS and is removed, and its action runs, when that animation ends.
  const finish = () => {
    if (!request) return;
    returnFocus.current = request.returnFocus;
    const { onConfirm } = request;
    setRequest(null);
    setClosing(false);
    if (confirmed.current) onConfirm();
  };

  useEffect(() => {
    if (backgroundRef.current) backgroundRef.current.inert = request !== null;
    if (request) {
      dialogRef.current?.focus({ preventScroll: true });
      return;
    }
    // The browser ignores focus() into an inert subtree, so it waits until the background is live.
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target instanceof HTMLElement && target.isConnected) target.focus({ preventScroll: true });
  }, [request]);

  return (
    <ConfirmContext.Provider value={ask}>
      <div ref={backgroundRef} className="td-ph-confirm-background">
        {children}
      </div>
      {request ? (
        <div
          className={closing ? 'td-ph-confirm-layer td-ph-confirm-layer--closing' : 'td-ph-confirm-layer'}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) close(false);
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            close(false);
          }}
        >
          <div
            ref={dialogRef}
            className="td-ph-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-message`}
            tabIndex={-1}
            onAnimationEnd={(event) => {
              if (closing && event.target === event.currentTarget) finish();
            }}
          >
            <div className="td-ph-confirm-group">
              <p className="td-ph-confirm-head">
                <b id={`${id}-title`}>{request.title}</b>
                <span id={`${id}-message`}>{request.message}</span>
              </p>
              <button
                type="button"
                className="td-ph-confirm-action td-ph-confirm-action--destructive"
                onClick={() => close(true)}
              >
                {request.action}
              </button>
            </div>
            <button
              type="button"
              className="td-ph-confirm-group td-ph-confirm-action td-ph-confirm-cancel"
              onClick={() => close(false)}
            >
              {t('action_cancel')}
            </button>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}
