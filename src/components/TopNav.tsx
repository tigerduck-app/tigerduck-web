import {
  DISCORD_URL,
  GDG_NTUST_URL,
  GITHUB_ORG_URL,
  SUPPORT_FORM_URL,
  TESTFLIGHT_URL,
} from '@/lib/constants';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LocaleToggle } from '@/components/LocaleToggle';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function TopNav() {
  const { locale } = useLocale();
  const messages = tFor(locale).nav;

  return (
    <nav className="td-nav" aria-label={messages.ariaLabel}>
      <div className="td-nav-inner">
        <a href="#top" className="td-nav-brand">
          <img src="/logo.png" alt="" className="td-nav-brand-icon" width={28} height={28} />
          <span>TigerDuck</span>
        </a>
        <div className="td-nav-links">
          <a href={GDG_NTUST_URL} className="td-nav-link">
            {messages.gdg}
          </a>
          <a href={GITHUB_ORG_URL} className="td-nav-link">
            {messages.github}
          </a>
          <a href={DISCORD_URL} className="td-nav-link">
            {messages.discord}
          </a>
          <a href={SUPPORT_FORM_URL} className="td-nav-link">
            {messages.support}
          </a>
          <a href={TESTFLIGHT_URL} className="td-nav-link td-nav-cta">
            {messages.download}
          </a>
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </div>
    </nav>
  );
}
