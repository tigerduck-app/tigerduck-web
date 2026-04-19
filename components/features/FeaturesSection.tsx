import { useTranslations } from "next-intl";
import { features } from "@/data/features";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  const t = useTranslations("features");
  return (
    <section id="features" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4">{t("title")}</h2>
          <p className="text-lg text-[var(--color-muted)]">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              title={t(`${feature.id}.title` as Parameters<typeof t>[0])}
              description={t(`${feature.id}.description` as Parameters<typeof t>[0])}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
