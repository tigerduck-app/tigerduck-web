import { useEffect, useMemo } from 'react';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { DeleteAccount } from '@/pages/DeleteAccount';
import { TigerSync } from '@/pages/TigerSync';
import { HelpIndex } from '@/pages/HelpIndex';
import { HelpReceiveMail, type HelpMailPlatform } from '@/pages/HelpReceiveMail';
import { useReveal } from '@/hooks/useReveal';
import { useRoute } from '@/hooks/useRoute';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { useEmbed } from '@/hooks/useEmbed';
import { useEmbedSurface } from '@/hooks/useEmbedSurface';
import { EXTERNAL_REDIRECTS } from '@/lib/constants';
import { matchSegment } from '@/lib/router';
import { tFor } from '@/lib/messages';
import { trackPageView } from '@/lib/analytics';

const HELP_RECEIVE_MAIL = '/help/receive-mail';

/**
 * `/help/receive-mail/:platform` — the only nested route so far. Returns null
 * when the path is not under that prefix, so everything else falls through to
 * the exact matches below.
 *
 * An unrecognised (or missing) platform segment deliberately renders the page
 * in its neutral 'unknown' state rather than redirecting: these URLs are
 * hard-coded in shipped app builds we cannot go back and fix, and the generic
 * steps are more use to whoever landed there than the marketing home page.
 */
function helpMailPlatform(path: string): HelpMailPlatform | null {
  const segment = matchSegment(path, HELP_RECEIVE_MAIL);
  if (segment === null) return null;
  if (segment === 'android' || segment === 'apple' || segment === 'other') return segment;
  return 'unknown';
}

export default function App() {
  const path = useRoute();
  const { locale } = useLocale();
  const embedded = useEmbed();
  // Keeps `data-theme` applied even in embed mode, where the nav — and with it
  // the theme toggle that normally owns this — is not rendered.
  useTheme();
  useEmbedSurface();
  useReveal([path, locale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', 'spacious');
  }, []);

  useEffect(() => {
    if (EXTERNAL_REDIRECTS[path]) return;
    trackPageView(path);
  }, [path]);

  useEffect(() => {
    const messages = tFor(locale);
    document.documentElement.lang = messages.htmlLang;
  }, [locale]);

  useEffect(() => {
    const target = EXTERNAL_REDIRECTS[path];
    if (target) window.location.replace(target);
  }, [path]);

  const page = useMemo(() => {
    if (path === '/privacy-policy') return <PrivacyPolicy />;
    if (path === '/delete-account') return <DeleteAccount />;
    // Older app versions link the TigerSync page by its former address.
    if (path === '/tigersync' || path === '/learn-more-about-backend') return <TigerSync />;
    // Registered before the receive-mail platform matcher below: '/help' is
    // an exact match and matchSegment('/help', '/help/receive-mail') already
    // returns null for it, but the ordering keeps the exact routes grouped
    // together and ahead of the nested-route fallback as topics are added.
    if (path === '/help') return <HelpIndex />;
    const helpPlatform = helpMailPlatform(path);
    if (helpPlatform) return <HelpReceiveMail platform={helpPlatform} />;
    return <HomePage />;
  }, [path]);

  if (EXTERNAL_REDIRECTS[path]) return null;

  // `?embed=1`: the app's WebView draws its own chrome, so the site nav,
  // footer and their theme/locale toggles are left out entirely.
  return (
    <div id="top" className={embedded ? 'td-page td-page--embed' : 'td-page'}>
      {embedded ? null : <TopNav />}
      <main className="td-page-main" key={path}>
        {page}
      </main>
      {embedded ? null : <Footer />}
    </div>
  );
}
