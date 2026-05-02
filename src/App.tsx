import { useEffect, useMemo } from 'react';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { DeleteAccount } from '@/pages/DeleteAccount';
import { useReveal } from '@/hooks/useReveal';
import { useRoute } from '@/hooks/useRoute';
import { useLocale } from '@/hooks/useLocale';
import { EXTERNAL_REDIRECTS } from '@/lib/constants';
import { tFor } from '@/lib/messages';

export default function App() {
  const path = useRoute();
  const { locale } = useLocale();
  useReveal([path, locale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', 'spacious');
  }, []);

  useEffect(() => {
    const messages = tFor(locale);
    document.documentElement.lang = messages.htmlLang;
  }, [locale]);

  useEffect(() => {
    const target = EXTERNAL_REDIRECTS[path];
    if (target) window.location.replace(target);
  }, [path]);

  const Page = useMemo(() => {
    if (path === '/privacy-policy') return PrivacyPolicy;
    if (path === '/delete-account') return DeleteAccount;
    return HomePage;
  }, [path]);

  if (EXTERNAL_REDIRECTS[path]) return null;

  return (
    <div id="top" className="td-page">
      <TopNav />
      <main className="td-page-main" key={path}>
        <Page />
      </main>
      <Footer />
    </div>
  );
}
