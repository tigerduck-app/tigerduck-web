import { useTranslations } from "next-intl";
import { roadmapItems } from "@/data/roadmap";
import type { RoadmapStatus } from "@/types/roadmap";

const statusIcons: Record<RoadmapStatus, string> = {
  done: "✓",
  "in-progress": "🛠",
  planned: "○",
};

const statusColors: Record<RoadmapStatus, string> = {
  done: "text-green-500",
  "in-progress": "text-[var(--color-brand-tiger)]",
  planned: "text-[var(--color-muted)]",
};

export default function RoadmapSection() {
  const t = useTranslations("roadmap");
  return (
    <section id="roadmap" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4">{t("title")}</h2>
          <p className="text-lg text-[var(--color-muted)]">{t("subtitle")}</p>
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          {roadmapItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className={`text-lg font-bold mt-0.5 ${statusColors[item.status]}`}>
                {statusIcons[item.status]}
              </span>
              <div>
                <div className="font-medium text-[var(--color-text)]">{item.titleZh}</div>
                {item.descriptionZh && (
                  <div className="text-sm text-[var(--color-muted)] mt-1">{item.descriptionZh}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
