import { useTranslations } from "next-intl";
import GlassCard from "./GlassCard";
import IOSDeviceFrame from "./IOSDeviceFrame";

export default function IOSShowcase() {
  const t = useTranslations("ios");
  return (
    <section
      id="ios"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t("title")}</h2>
          <p className="text-lg text-white/70">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-white">
            <div className="text-3xl mb-3">🏝️</div>
            <h3 className="font-semibold mb-2">Dynamic Island</h3>
            <p className="text-sm text-white/70">即時顯示課程與作業狀態</p>
          </GlassCard>
          <GlassCard className="p-6 text-white">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Widget</h3>
            <p className="text-sm text-white/70">桌面小工具快速查看資訊</p>
          </GlassCard>
          <GlassCard className="p-6 text-white">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Live Activity</h3>
            <p className="text-sm text-white/70">鎖定畫面即時動態更新</p>
          </GlassCard>
        </div>
        <div className="mt-12 flex justify-center">
          <IOSDeviceFrame screenshot="/screenshots/homework-ios.png" alt="TigerDuck iOS homework view" />
        </div>
      </div>
    </section>
  );
}
