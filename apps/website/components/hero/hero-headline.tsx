export function HeroHeadline() {
  return (
    <h1 className="font-bold tracking-tight select-none leading-[1.02] text-[clamp(44px,7.5vw,96px)] -tracking-[0.04em] mb-10">
      {/* Line 1 — pure white with premium vertical fade mask (Vercel-inspired) */}
      <span className="block bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent text-balance leading-[1.04] pb-2">
        Permission checks that
      </span>

      {/* Line 2 — animated gradient with refined glow */}
      <span className="relative block mt-[0.02em]">
        {/* Diffuse ambient glow behind text */}
        <span
          aria-hidden="true"
          className="absolute inset-0 blur-[100px] opacity-20 bg-gradient-to-r from-[#c4b5fd] via-[#818cf8] to-[#6366f1] pointer-events-none"
        />

        {/* Main text — slow-shifting gradient with richer stops */}
        <span className="relative inline-block bg-gradient-to-r from-[#e0d7ff] via-[#a5b4fc] via-[#818cf8] via-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent bg-[length:250%_100%] animate-[gradient-slow_10s_cubic-bezier(0.45,0.05,0.15,1)_infinite] drop-shadow-[0_0_60px_rgba(99,102,241,0.15)]">
          explain themselves
        </span>
      </span>
    </h1>
  );
}
