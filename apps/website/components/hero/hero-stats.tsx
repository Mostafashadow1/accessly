/**
 * HeroStats — key metrics displayed as premium mini cards.
 *
 * Each stat is presented in a subtle card-like container with better
 * visual emphasis and spacing than a plain text row.
 */

const stats = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
] as const;

export function HeroStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-16 pt-8 border-t border-border">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl bg-surface/40 border border-border hover:border-primary/10 hover:bg-primary/[0.02] transition-all duration-200"
        >
          <span className="font-bold text-[26px] leading-none text-foreground -tracking-[0.03em]">
            {s.val}
          </span>
          <span className="text-[11px] text-muted uppercase tracking-[0.08em] font-medium">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
