import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-3">{t("about")}</h3>
            <p className="text-sm text-[var(--color-muted)] mb-2">{t("aboutDesc")}</p>
            <p className="text-xs text-[var(--color-muted)] italic">{t("disclaimer")}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-3">{t("links")}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/tigerduck-app/tigerduck-app" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">iOS GitHub</a></li>
              <li><a href="https://github.com/tigerduck-app/tigerduck-app-android" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">Android GitHub</a></li>
              <li><a href="https://testflight.apple.com/join/eVt9Gjkw" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">TestFlight</a></li>
              <li><Link href="/privacy-policy" className="text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/delete-account" className="text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">Delete Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-3">{t("contact")}</h3>
            <a href="mailto:tigerduckapp@gmail.com" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent-blue)] transition-colors">
              tigerduckapp@gmail.com
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
