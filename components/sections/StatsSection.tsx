import type { ProjectStats } from "@/types/stats";
import { useTranslations } from "next-intl";

interface StatsSectionProps {
  stats: ProjectStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const t = useTranslations("stats");
  return (
    <section id="stats" className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-6xl font-bold text-[var(--color-brand-tiger)]">{stats.iosStars}⭐</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">{t("iosStars")}</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-bold text-[var(--color-accent-blue)]">{stats.androidStars}⭐</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">{t("androidStars")}</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-bold text-[var(--color-brand-duck)]">{stats.iosContributors + stats.androidContributors}</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">{t("contributors")}</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold text-[var(--color-text)]">{stats.latestVersion}</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">{t("version")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
