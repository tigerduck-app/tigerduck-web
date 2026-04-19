import { useTranslations } from "next-intl";
import M3Card from "./M3Card";
import AndroidDeviceFrame from "./AndroidDeviceFrame";

export default function AndroidShowcase() {
  const t = useTranslations("android");
  return (
    <section id="android" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4">{t("title")}</h2>
          <p className="text-lg text-[var(--color-muted)]">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <M3Card elevated>
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">時光機</h3>
            <p className="text-sm text-[var(--color-muted)]">流動軌道 / 課程區塊雙樣式</p>
          </M3Card>
          <M3Card elevated>
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Material You</h3>
            <p className="text-sm text-[var(--color-muted)]">動態配色跟隨系統主題</p>
          </M3Card>
          <M3Card elevated>
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">F-Droid 友善</h3>
            <p className="text-sm text-[var(--color-muted)]">開源、無追蹤、AGPL-3.0</p>
          </M3Card>
        </div>
        <div className="flex justify-center">
          <AndroidDeviceFrame alt="TigerDuck Android view" />
        </div>
      </div>
    </section>
  );
}
