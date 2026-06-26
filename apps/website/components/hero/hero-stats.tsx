/**
 * HeroStats — key metrics displayed as a horizontal row.
 *
 * Improved spacing and typographic hierarchy over the original.
 */

const stats = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
] as const;

export function HeroStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mt-16 pt-8 border-t border-border">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1.5">
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
