import { HeroBackground } from "./hero-background";
import { HeroHeadline } from "./hero-headline";
import { HeroDescription } from "./hero-description";
import { HeroCTA } from "./hero-cta";
import { HeroStats } from "./hero-stats";

/**
 * HeroSection — main entry point for the landing page.
 *
 * Refined layout with premium vertical rhythm, a subtle entry animation
 * on the content container, and better overall hierarchy.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* ── Content block ── */}
        <div className="flex flex-col items-center text-center max-w-[960px] mx-auto pt-24 pb-24 md:pt-28 md:pb-28 animate-[fadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-accent bg-primary-light border border-primary/15 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-[pulse-live_2s_ease-in-out_infinite]" />
            v0.1.0 · Open Source · MIT Licensed
          </div>

          <HeroHeadline />
          <HeroDescription />
          <HeroCTA />
          <HeroStats />
        </div>
      </div>
    </section>
  );
}
