/**
 * HeroPlayground — the interactive demo section immediately below the hero.
 *
 * Full-width dark panel. The playground is the centerpiece product experience.
 */
import { Playground } from "@/components/playground";

export function HeroPlayground() {
  return (
    <section
      id="playground"
      className="w-full border-t border-border overflow-hidden relative"
      style={{
        background:
          "linear-gradient(to bottom, rgba(8,8,10,0.95) 0%, rgba(6,6,8,0.98) 100%)",
      }}
    >
      {/* Subtle top glow echoing the hero */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Section header */}
      <div className="relative z-10 flex flex-col items-center text-center pt-16 pb-10 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-accent bg-primary-light border border-primary/20 mb-5">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-[pulse-live_2s_ease-in-out_infinite]"
          />
          Interactive Demo
        </div>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold text-foreground -tracking-[0.03em] leading-tight">
          Live Playground
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted mt-3 max-w-[500px] leading-relaxed text-balance">
          Select a backend, send a request, and trace every decision through the
          pipeline in real time.
        </p>
      </div>

      {/* Playground */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 pb-16 md:pb-24 max-w-[1440px] mx-auto">
        <Playground />
      </div>
    </section>
  );
}
