import { HeroBackground } from "./hero-background";
import { HeroHeadline } from "./hero-headline";
import { HeroDescription } from "./hero-description";
import { HeroCTA } from "./hero-cta";
import { HeroStats } from "./hero-stats";
import { Playground } from "./playground";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* ── Text block ── */}
        <div className="flex flex-col items-center text-center max-w-[960px] mx-auto pt-12 pb-20">
          {/* Badge */}
          <div className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            v0.1.0 · Open Source · MIT Licensed
          </div>

          <HeroHeadline />
          <HeroDescription />
          <HeroCTA />
          <HeroStats />
        </div>

        {/* ── Playground section header ── */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse-live" />
            Interactive Demo
          </div>
          <h2 className="text-[22px] md:text-[28px] font-bold text-foreground -tracking-[0.025em] leading-tight mt-1">
            Live Playground
          </h2>
          <p className="text-[14px] text-muted mt-2 max-w-[480px] text-balance">
            Select a backend, send a request, and trace every decision through
            the pipeline in real time.
          </p>
        </div>

        <div className="relative -mb-0.5">
          <Playground />
        </div>
      </div>
    </section>
  );
}
