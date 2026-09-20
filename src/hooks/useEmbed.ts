import { useEffect, useState } from 'react';
import { isEmbedded } from '@/lib/embed';
import { subscribe } from '@/lib/router';

/**
 * Reactive `?embed=1`. Subscribes to the router because in-app navigation
 * pushes a bare path (no query string), which takes the page back out of
 * embed mode — the same thing a reload would do.
 */
export function useEmbed(): boolean {
  const [embedded, setEmbedded] = useState<boolean>(() => isEmbedded());

  useEffect(() => subscribe(() => setEmbedded(isEmbedded())), []);

  return embedded;
}
