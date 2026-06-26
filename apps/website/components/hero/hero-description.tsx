/**
 * HeroDescription — readable value proposition with inline code highlights.
 *
 * Increased max-width, balanced wrapping, and comfortable line-height
 * for a premium reading experience.
 */
export function HeroDescription() {
  return (
    <p className="text-[17px] md:text-[18px] text-muted leading-relaxed md:leading-[1.75] text-center max-w-[580px] mx-auto mb-14 px-4 text-balance">
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
