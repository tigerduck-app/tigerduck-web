import type { Contributor } from "@/types/contributor";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface TeamSectionProps {
  contributors: Contributor[];
}

export default function TeamSection({ contributors }: TeamSectionProps) {
  const t = useTranslations("team");
  return (
    <section id="team" className="py-24 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4">{t("title")}</h2>
          <p className="text-lg text-[var(--color-muted)]">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 mb-12">
          {contributors.map((contributor) => (
            <a
              key={contributor.login}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-accent-blue)] transition-colors">
                <Image src={contributor.avatar} alt={contributor.login} fill className="object-cover" />
              </div>
              <span className="text-xs text-[var(--color-muted)] group-hover:text-[var(--color-text)] transition-colors text-center truncate w-full">
                {contributor.login}
              </span>
            </a>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://github.com/tigerduck-app/tigerduck-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            {t("contribute")} →
          </a>
        </div>
      </div>
    </section>
  );
}
