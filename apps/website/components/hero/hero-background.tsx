/**
 * HeroBackground — layered atmospheric effects for the hero section.
 *
 * Combines radial gradients, grid lines, dot pattern, soft noise, and
 * ambient light spots to create elegant depth without distraction.
 *
 * Uses inline Tailwind classes exclusively — no custom CSS utilities.
 */
export function HeroBackground() {
  return (
    <>
      {/* Primary radial glow — top center (softer, wider) */}
      <div
        className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1800px] h-[800px] rounded-full pointer-events-none blur-[1px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.025) 45%, transparent 70%)",
        }}
      />

      {/* Soft arc ring */}
      <div
        className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[1600px] h-[650px] rounded-full border border-[rgba(99,102,241,0.05)] pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 75%)",
        }}
      />

      {/* Radiant glow behind the title */}
      <div
        className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[450px] rounded-full pointer-events-none blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, rgba(99,102,241,0.025) 40%, transparent 70%)",
        }}
      />

      {/* Fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Grid lines with vertical fade mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.007) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.007) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)",
        }}
      />

      {/* Extremely subtle CSS noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Ambient light — right side (brighter center) */}
      <div className="absolute top-[12%] right-[-6%] w-[600px] h-[600px] rounded-full pointer-events-none blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.02) 35%, transparent 65%)",
        }}
      />

      {/* Ambient light — left side */}
      <div className="absolute top-[40%] left-[-6%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Subtle bottom-right accent light */}
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade into page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #08080a)",
        }}
      />
    </>
  );
}
