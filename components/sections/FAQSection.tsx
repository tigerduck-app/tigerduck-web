import { useTranslations } from "next-intl";
import { faqItems } from "@/data/faq";

export default function FAQSection() {
  const t = useTranslations("faq");
  return (
    <section id="faq" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4">{t("title")}</h2>
          <p className="text-lg text-[var(--color-muted)]">{t("subtitle")}</p>
        </div>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors list-none">
                {item.questionZh}
                <span className="text-[var(--color-muted)] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[var(--color-muted)] leading-relaxed">
                {item.answerZh}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
