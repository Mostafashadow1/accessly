/**
 * HeroBackground — layered atmospheric effects for the hero section.
 *
 * Combines radial gradients, grid lines, dot pattern, soft noise, and
 * ambient light spots to create elegant depth without distraction.
 */
export function HeroBackground() {
  return (
    <>
      {/* Primary radial glow — top center */}
      <div className="hero-radial-top" />

      {/* Soft arc ring */}
      <div className="hero-arc-ring" />

      {/* Fine dot grid */}
      <div className="absolute inset-0 bg-dot-grid-lg pointer-events-none" />

      {/* Grid lines with vertical fade mask */}
      <div className="hero-grid-lines" />

      {/* Extremely subtle CSS noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Ambient light — right side */}
      <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_65%)] pointer-events-none blur-[80px]" />

      {/* Ambient light — left side */}
      <div className="absolute top-[45%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,transparent_65%)] pointer-events-none blur-[100px]" />

      {/* Bottom fade into page */}
      <div className="hero-bottom-fade" />
    </>
  );
}
