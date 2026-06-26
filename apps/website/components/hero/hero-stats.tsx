/**
 * HeroStats — key metrics displayed as premium mini cards.
 *
 * Cleaner, more refined cards with tighter spacing and a subtle
 * hover-lift effect that feels cohesive with the polished hero.
 */

const stats = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
] as const;

export function HeroStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-14 pt-7 border-t border-border/60">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface/30 border border-border/60 hover:border-primary/15 hover:bg-primary/[0.03] hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="font-bold text-[24px] leading-none text-foreground -tracking-[0.03em]">
            {s.val}
          </span>
          <span className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
