import { HeroBackground } from "./hero-background";
import { HeroHeadline } from "./hero-headline";
import { HeroDescription } from "./hero-description";
import { HeroCTA } from "./hero-cta";
import { HeroStats } from "./hero-stats";

/**
 * HeroSection — full-viewport entry point.
 *
 * Content block stagger:
 *  - Badge: immediate (no delay)
 *  - Headline: 0.1s delay
 *  - Description: 0.2s delay
 *  - CTA: 0.3s delay
 *  - Stats: 0.45s delay
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <HeroBackground />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center max-w-[1000px] mx-auto pt-28 pb-24 md:pt-32 md:pb-28">

          {/* Version badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-accent bg-primary-light border border-primary/20 mb-8 opacity-0 animate-[fadeUp_0.5s_ease_0.05s_forwards]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-[pulse-live_2s_ease-in-out_infinite]" />
            v0.1.0 &middot; Open Source &middot; MIT Licensed
          </div>

          {/* Headline */}
          <div className="opacity-0 animate-[fadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_0.1s_forwards] w-full">
            <HeroHeadline />
          </div>

          {/* Description */}
          <div className="opacity-0 animate-[fadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_0.22s_forwards]">
            <HeroDescription />
          </div>

          {/* CTA */}
          <div className="opacity-0 animate-[fadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_0.34s_forwards]">
            <HeroCTA />
          </div>

          {/* Stats */}
          <div className="opacity-0 animate-[fadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_0.5s_forwards] w-full">
            <HeroStats />
          </div>
        </div>
      </div>
    </section>
  );
}
