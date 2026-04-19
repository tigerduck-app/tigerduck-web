"use client";

import dynamic from "next/dynamic";
import HeroFallback from "./HeroFallback";
import { useTranslations } from "next-intl";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export default function HeroSection() {
  const t = useTranslations("hero");
  const ctaT = useTranslations("cta");
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Hero3D />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-brand-tiger)]/10 text-[var(--color-brand-tiger)] mb-4">
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://testflight.apple.com/join/eVt9Gjkw"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="ios-beta-cta"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-tiger)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <span>🍎</span>
              <div>
                <div className="text-sm">{ctaT("ios")}</div>
                <div className="text-xs opacity-80">{ctaT("iosSub")}</div>
              </div>
            </a>
            <a
              href="https://tigerduck.app/discord"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="android-beta-cta"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent-blue)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <span>🤖</span>
              <div>
                <div className="text-sm">{ctaT("android")}</div>
                <div className="text-xs opacity-80">{ctaT("androidSub")}</div>
              </div>
            </a>
          </div>
          {/* FUTURE: <AppStoreBadge /> <PlayStoreBadge /> <FDroidBadge /> */}
        </div>
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
