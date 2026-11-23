import { useCallback, useState } from 'react';

/** How long a pretend refresh takes; the demo has no network. */
const REFRESH_MS = 1100;

export function useRefresh(): { busy: boolean; refresh: () => Promise<void> } {
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, REFRESH_MS));
    setBusy(false);
  }, []);
  return { busy, refresh };
}
