/**
 * HeroDescription — readable value proposition with inline code highlights.
 *
 * Larger font size, improved line-height, and generous spacing
 * for a premium developer-product reading experience.
 */
export function HeroDescription() {
  return (
    <p className="text-[17px] sm:text-[18px] md:text-[19px] text-muted leading-[1.75] md:leading-[1.8] text-center max-w-[600px] mx-auto mb-16 px-4 text-balance">
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
