/**
 * HeroBackground — layered atmospheric system for the hero.
 *
 * Three-layer stack:
 *  1. Deep radial bloom (canvas-level glow)
 *  2. Grid + dot texture (adds spatial depth)
 *  3. Ambient accent lights (left/right fill)
 */
export function HeroBackground() {
  return (
    <>
      {/* ── Layer 1: Primary bloom — massive top-center radial ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[900px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.13) 0%, rgba(99,102,241,0.04) 50%, transparent 75%)",
        }}
      />

      {/* Tighter inner bloom — the 'hot spot' above the headline */}
      <div
        aria-hidden="true"
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none blur-[2px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 65%)",
        }}
      />

      {/* ── Layer 2: Grid texture with vertical fade mask ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 65%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 65%, transparent 100%)",
        }}
      />

      {/* Fine dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 80%)",
        }}
      />

      {/* ── Arc ring — subtle horizon arc ── */}
      <div
        aria-hidden="true"
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] rounded-full border border-[rgba(99,102,241,0.06)] pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 70%)",
        }}
      />

      {/* ── Layer 3: Ambient fill lights ── */}

      {/* Right ambient — indigo warm */}
      <div
        aria-hidden="true"
        className="absolute top-[8%] right-[-8%] w-[700px] h-[700px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.03) 40%, transparent 65%)",
        }}
      />

      {/* Left ambient — violet cool */}
      <div
        aria-hidden="true"
        className="absolute top-[35%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.055) 0%, transparent 60%)",
        }}
      />

      {/* ── Noise film — adds organic texture ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.018] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── Bottom fade to page ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(8,8,10,0.6) 60%, #08080a 100%)",
        }}
      />
    </>
  );
}
