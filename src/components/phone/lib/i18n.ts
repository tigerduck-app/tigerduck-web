import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/locale';
import table from '../data/strings.json';

const STRINGS = table as Record<Locale, Record<string, string>>;

/**
 * Marks a localization key without looking it up, for tables of keys. `npm run sync-demo` copies
 * every key passed to t() or k() from app-translation.
 */
export function k(key: string): string {
  return key;
}

/** Fills Apple's format specifiers (%@, %d, %lld, %s and their %1$ positional forms). */
export function format(template: string, args: readonly (string | number)[]): string {
  let next = 0;
  return template.replace(/%(?:(\d+)\$)?(?:@|lld|ld|d|s|%)/g, (spec, position: string | undefined) => {
    if (spec === '%%') return '%';
    const index = position ? Number(position) - 1 : next++;
    return String(args[index] ?? '');
  });
}

export type Translate = (key: string, ...args: (string | number)[]) => string;

export function translator(locale: Locale): Translate {
  const strings = STRINGS[locale];
  return (key, ...args) => {
    const template = strings[key];
    if (template === undefined) {
      if (import.meta.env.DEV) console.warn(`[phone] run npm run sync-demo: no string for ${key}`);
      return key;
    }
    return args.length ? format(template, args) : template;
  };
}

export interface PhoneLocale {
  locale: Locale;
  t: Translate;
}

export const LocaleContext = createContext<PhoneLocale>({ locale: 'zh', t: translator('zh') });

export function usePhoneLocale(): PhoneLocale {
  return useContext(LocaleContext);
}
