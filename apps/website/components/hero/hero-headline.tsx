export function HeroHeadline() {
  return (
    <h1 className="font-bold tracking-tight select-none leading-[1.02] text-[clamp(44px,7.5vw,96px)] -tracking-[0.04em] mb-10">
      {/* Line 1 — white with subtle downward fade */}
      <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent text-balance">
        Permission checks that
      </span>

      {/* Line 2 — premium gradient focus */}
      <span className="relative block mt-[0.04em]">
        {/* Soft glow behind the text */}
        <span
          aria-hidden="true"
          className="absolute inset-0 blur-[80px] opacity-25 bg-gradient-to-r from-[#c4b5fd] via-[#818cf8] to-[#6366f1] bg-clip-text text-transparent pointer-events-none"
        >
          explain themselves
        </span>

        {/* Main gradient text — slowly shifting */}
        <span className="relative inline-block bg-gradient-to-r from-[#ddd6fe] via-[#a5b4fc] via-[#818cf8] via-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-slow drop-shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          explain themselves
        </span>
      </span>
    </h1>
  );
}
