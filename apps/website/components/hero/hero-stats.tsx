/**
 * HeroStats — four key metrics rendered as premium mini-cards.
 *
 * Subtle hover-lift + border glow. Numbers use a tight -0.03em tracking
 * so they read as precise technical data, not marketing fluff.
 */

const stats = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
] as const;

export function HeroStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-12 pt-8 border-t border-border/50 w-full">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl bg-surface/40 border border-border/60 hover:border-primary/25 hover:bg-primary/[0.035] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.06)] transition-all duration-200 cursor-default"
        >
          <span className="font-bold text-[26px] leading-none text-foreground -tracking-[0.03em] group-hover:text-white transition-colors duration-200">
            {s.val}
          </span>
          <span className="text-[10px] text-muted uppercase tracking-[0.12em] font-semibold">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
