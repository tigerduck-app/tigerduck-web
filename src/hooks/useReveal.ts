import { useEffect } from 'react';

/**
 * IntersectionObserver-driven reveal. Re-runs whenever any value in `deps`
 * changes — pass the current route path so newly-mounted elements are picked up.
 */
export function useReveal(deps: ReadonlyArray<unknown> = []) {
  useEffect(() => {
    // Defer one frame so newly mounted page DOM is in place before query.
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll<HTMLElement>('.td-reveal:not(.is-visible)');
      if (els.length === 0) return;

      if (typeof IntersectionObserver === 'undefined') {
        els.forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      els.forEach((el, i) => {
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
        }
        io.observe(el);
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
