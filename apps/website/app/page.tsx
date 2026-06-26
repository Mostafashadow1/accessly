import { HeroSection } from "@/components/home/hero-section";
import { HeroPlayground } from "@/components/home/hero-playground";
import { FeatureBarSection } from "@/components/home/feature-bar-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { BentoGridSection } from "@/components/home/bento-grid-section";
import { BackendSection } from "@/components/home/backend-section";
import { DecisionSection } from "@/components/home/decision-section";
import { CtaSection } from "@/components/home/cta-section";

/**
 * HomePage — orchestrates all homepage sections.
 * Each section is extracted into its own component under components/home/.
 *
 * Section order:
 *   1. Hero
 *   2. Playground
 *   3. Feature Bar
 *   4. How It Works
 *   5. Bento Grid
 *   6. Your Backend, Any Shape
 *   7. Decision Inspector
 *   8. Bottom CTA
 */
export default function HomePage() {
  return (
    <div className="bg-canvas min-h-screen">
      <HeroSection />
      <HeroPlayground />
      <FeatureBarSection />
      <HowItWorksSection />
      <BentoGridSection />
      <BackendSection />
      <DecisionSection />
      <CtaSection />
    </div>
  );
}

