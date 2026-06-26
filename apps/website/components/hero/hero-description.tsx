/**
 * HeroDescription — readable value proposition with inline code highlights.
 *
 * Wider, airier layout with refined text balance for a premium
 * developer-product reading experience.
 */
export function HeroDescription() {
  return (
    <p className="text-[17px] sm:text-[18px] md:text-[19px] text-muted leading-[1.8] md:leading-[1.85] text-center max-w-[680px] mx-auto mb-14 px-6 text-balance">
      Every library returns <code>true</code> or{" "}
      <code className="text-danger bg-danger-bg border-danger/20">
        false
      </code>
      . Accessly returns{" "}
      <strong className="text-foreground font-semibold">why</strong> —
      matched rules, missing permissions, and the exact source of every
      decision.
    </p>
  );
}
