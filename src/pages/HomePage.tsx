import { HeroB } from '@/components/hero/HeroB';
import { WhySection } from '@/components/sections/WhySection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { TechSection } from '@/components/sections/TechSection';
import { RoadmapSection } from '@/components/sections/RoadmapSection';
import { CTASection } from '@/components/sections/CTASection';

export function HomePage() {
  return (
    <>
      <HeroB />
      <WhySection />
      <FeaturesSection />
      <TechSection />
      <RoadmapSection />
      <CTASection />
    </>
  );
}
