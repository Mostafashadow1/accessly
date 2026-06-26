export function HeroHeadline() {
  return (
    <h1 className="font-bold tracking-tight select-none leading-[1.02] text-[clamp(44px,7.5vw,96px)] -tracking-[0.04em] mb-12">
      {/* Line 1 — white with subtle downward fade, balanced */}
      <span className="block bg-gradient-to-b from-white via-white/95 to-white/75 bg-clip-text text-transparent text-balance leading-[1.04] pb-2">
        Permission checks that
      </span>

      {/* Line 2 — premium gradient focus, iconic */}
      <span className="relative block mt-[0.02em]">
        {/* Soft glow behind the text */}
        <span
          aria-hidden="true"
          className="absolute inset-0 blur-[80px] opacity-25 bg-gradient-to-r from-[#c4b5fd] via-[#818cf8] to-[#6366f1] bg-clip-text text-transparent pointer-events-none"
        >
          explain themselves
        </span>

        {/* Reflection layer — extremely subtle, below the main text */}
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[0.06em] blur-[1px] opacity-[0.07] bg-gradient-to-r from-[#c4b5fd] via-[#818cf8] to-[#6366f1] bg-clip-text text-transparent pointer-events-none"
        >
          explain themselves
        </span>

        {/* Main gradient text — slowly shifting with bottom fade mask */}
        <span className="relative inline-block bg-gradient-to-r from-[#ddd6fe] via-[#a5b4fc] via-[#818cf8] via-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-slow drop-shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          explain themselves
        </span>
      </span>
    </h1>
  );
}
