/**
 * HeroDescription — sharp value-prop paragraph beneath the headline.
 *
 * Highlights the core differentiator: Accessly returns WHY,
 * not just true/false. Inline code tokens reinforce the technical voice.
 */
export function HeroDescription() {
  return (
    <p className="text-[17px] sm:text-[18px] md:text-[19px] text-muted leading-[1.85] text-center max-w-[640px] mx-auto mb-12 px-4 text-balance">
      Every library returns <code>true</code> or{" "}
      <code className="text-danger bg-danger-bg border-danger/20">false</code>.
      Accessly returns{" "}
      <strong className="text-foreground font-semibold not-italic">
        why
      </strong>{" "}
      — matched rules, missing permissions, and the exact source of every
      decision.
    </p>
  );
}
