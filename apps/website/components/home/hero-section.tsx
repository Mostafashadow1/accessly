import { HeroSection as Hero } from "@/components/hero/hero-section";

/**
 * HeroSection — wraps the existing hero sub-components.
 * Keeping the sub-components under components/hero/ and re-exporting
 * here for consistent imports under components/home/.
 */
export function HeroSection() {
  return <Hero />;
}
