/**
 * HeroHeadline — the most important element on the page.
 *
 * Two-line structure:
 *  Line 1: "Permission checks that" — white, vertical-fade masked
 *  Line 2: "explain themselves" — slow-shifting indigo→violet gradient
 *
 * Font size scales from 48px (mobile) to 96px (desktop).
 * Tight negative tracking (-0.04em) reads as premium confidence.
 */
export function HeroHeadline() {
  return (
    <h1 className="font-bold select-none leading-[1.0] -tracking-[0.04em] mb-10 w-full">
      {/* Line 1 — pure white with luminance fade at bottom edge */}
      <span
        className="block text-[clamp(48px,8vw,96px)] leading-[1.02] pb-1 text-balance"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.92) 60%, rgba(255,255,255,0.72) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Permission checks that
      </span>

      {/* Line 2 — animated gradient with ambient glow bloom */}
      <span className="relative block text-[clamp(48px,8vw,96px)] leading-[1.04] mt-[0.02em]">
        {/* Diffuse glow bloom behind the text — feels like light source */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: "blur(80px)",
            opacity: 0.22,
            background:
              "linear-gradient(90deg, #c4b5fd 0%, #818cf8 40%, #6366f1 70%, #4f46e5 100%)",
          }}
        />

        {/* The gradient text itself */}
        <span
          className="relative inline-block bg-clip-text text-transparent bg-[length:250%_100%] animate-[gradient-slow_10s_cubic-bezier(0.45,0.05,0.15,1)_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #e0d7ff 0%, #a5b4fc 20%, #818cf8 40%, #6366f1 65%, #4f46e5 85%, #a5b4fc 100%)",
            filter: "drop-shadow(0 0 40px rgba(99,102,241,0.18))",
          }}
        >
          explain themselves
        </span>
      </span>
    </h1>
  );
}
