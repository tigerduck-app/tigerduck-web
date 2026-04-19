import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EasterEgg from "@/components/EasterEgg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh-TW";

  return {
    title: isZh ? "TigerDuck — 臺科大校園助手" : "TigerDuck — NTUST Campus Helper",
    description: isZh
      ? "由臺科大學生建造的校園助手 App，整合作業、課表、圖書館、行事曆"
      : "Campus assistant app built by NTUST students. Homework, schedule, library, calendar — all in one.",
    alternates: {
      canonical: isZh ? "https://tigerduck.app" : "https://tigerduck.app/en",
      languages: {
        "zh-TW": "https://tigerduck.app",
        en: "https://tigerduck.app/en",
      },
    },
    openGraph: {
      title: isZh ? "TigerDuck — 臺科大校園助手" : "TigerDuck — NTUST Campus Helper",
      description: isZh
        ? "由臺科大學生建造的校園助手 App"
        : "Campus assistant app built by NTUST students",
      locale: isZh ? "zh_TW" : "en_US",
      alternateLocale: isZh ? "en_US" : "zh_TW",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <EasterEgg />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
