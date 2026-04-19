import { fetchProjectStats, fetchContributors, mergeContributors } from "@/lib/github";
import { statsFallback } from "@/data/stats-fallback";
import type { Contributor } from "@/types/contributor";
import HeroSection from "@/components/hero/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import IOSShowcase from "@/components/ios/IOSShowcase";
import AndroidShowcase from "@/components/android/AndroidShowcase";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TeamSection from "@/components/sections/TeamSection";
import FAQSection from "@/components/sections/FAQSection";

export const revalidate = 3600;

export default async function Home() {
  let stats = statsFallback;
  let contributors: Contributor[] = [];

  try {
    const [fetchedStats, iosContributors, androidContributors] = await Promise.all([
      fetchProjectStats().catch(() => statsFallback),
      fetchContributors("tigerduck-app", "tigerduck-app", "ios").catch(() => []),
      fetchContributors("tigerduck-app", "tigerduck-app-android", "android").catch(() => []),
    ]);
    stats = fetchedStats;
    contributors = mergeContributors(iosContributors, androidContributors);
  } catch {
  }

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <IOSShowcase />
      <AndroidShowcase />
      <RoadmapSection />
      <TeamSection contributors={contributors} />
      <FAQSection />
      {/* FUTURE: <AppStoreBadge /> <PlayStoreBadge /> <FDroidBadge /> */}
    </>
  );
}
