import { useCallback, useEffect, useState } from 'react';
import { getLocale, setLocale, subscribe, type Locale } from '@/lib/locale';

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void; toggle: () => void } {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale());

  useEffect(() => subscribe(() => setLocaleState(getLocale())), []);

  const change = useCallback((l: Locale) => setLocale(l), []);
  const toggle = useCallback(() => {
    setLocale(getLocale() === 'zh' ? 'en' : 'zh');
  }, []);

  return { locale, setLocale: change, toggle };
}
