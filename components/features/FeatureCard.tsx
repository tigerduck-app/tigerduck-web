import type { Feature } from "@/types/feature";
import Image from "next/image";

interface FeatureCardProps {
  feature: Feature;
  title: string;
  description: string;
}

const platformLabels: Record<string, string> = {
  ios: "iOS",
  android: "Android",
  both: "雙平台",
};

export default function FeatureCard({ feature, title, description }: FeatureCardProps) {
  return (
    <div
      data-testid="feature-card"
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{feature.icon}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-brand-tiger)]/10 text-[var(--color-brand-tiger)] font-medium">
          {platformLabels[feature.platform]}
        </span>
      </div>
      <h3 className="font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-muted)]">{description}</p>
      {feature.screenshot && (
        <div className="mt-4 rounded-xl overflow-hidden aspect-[9/16] relative max-h-48">
          <Image src={feature.screenshot} alt={title} fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
