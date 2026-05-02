import { useEffect, useState } from 'react';
import { getPath, subscribe } from '@/lib/router';

export function useRoute(): string {
  const [path, setPath] = useState<string>(() => getPath());

  useEffect(() => subscribe(() => setPath(getPath())), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, [path]);

  return path;
}
