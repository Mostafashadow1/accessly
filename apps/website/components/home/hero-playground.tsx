import { Playground } from "@/components/playground";

/**
 * HeroPlayground — the interactive demo playground section on the homepage.
 */
export function HeroPlayground() {
  return (
    <section className="w-full border-t border-border overflow-hidden bg-[rgba(6,6,8,0.3)]">
      <div className="flex flex-col items-center text-center pt-16 pb-10 px-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-accent bg-primary-light border border-primary/15 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-[pulse-live_2s_ease-in-out_infinite]" />
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
      <div className="w-full px-4 md:px-8 lg:px-12 pb-16 md:pb-20 max-w-[1440px] mx-auto">
        <Playground />
      </div>
    </section>
  );
}
