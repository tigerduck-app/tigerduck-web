import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function LocaleToggle() {
  const { locale, toggle } = useLocale();
  const messages = tFor(locale);
  const targetLabel = locale === 'zh' ? 'English' : '中文';
  const display = locale === 'zh' ? 'EN' : '中';

  return (
    <button
      type="button"
      onClick={toggle}
      className="td-locale-toggle"
      aria-label={messages.localeToggle.switchTo(targetLabel)}
      title={messages.localeToggle.switchTo(targetLabel)}
    >
      <span aria-hidden="true">{display}</span>
    </button>
  );
}
