import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 overflow-hidden">
      {/* Radial glow behind the 404 */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, transparent 65%)",
          filter: "blur(2px)",
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-[560px]">
        {/* 404 numeral */}
        <p
          className="text-[clamp(96px,18vw,180px)] font-bold leading-none -tracking-[0.05em] select-none mb-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
          aria-label="404"
        >
          404
        </p>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground -tracking-[0.025em] mb-3">
          Page not found
        </h1>

        <p className="text-[15px] text-muted leading-relaxed mb-8 max-w-[400px] text-balance">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Accessly-flavored decision output */}
        <div className="w-full rounded-xl border border-border bg-surface overflow-hidden mb-8 text-left">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface/60">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/60" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/60" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/60" aria-hidden="true" />
            <span className="font-mono text-[11px] text-muted ml-1.5">
              decision.json
            </span>
          </div>
          <pre className="m-0 p-5 text-[12px] font-mono leading-relaxed overflow-auto">
            <span style={{ color: "#8c8c99" }}>{"{"}</span>{"\n"}
            {"  "}<span style={{ color: "#a5b4fc" }}>&quot;allowed&quot;</span>
            <span style={{ color: "#8c8c99" }}>: </span>
            <span style={{ color: "#ef4444" }}>false</span>
            <span style={{ color: "#8c8c99" }}>,</span>{"\n"}
            {"  "}<span style={{ color: "#a5b4fc" }}>&quot;reason&quot;</span>
            <span style={{ color: "#8c8c99" }}>: </span>
            <span style={{ color: "#86efac" }}>&quot;route_not_found&quot;</span>
            <span style={{ color: "#8c8c99" }}>,</span>{"\n"}
            {"  "}<span style={{ color: "#a5b4fc" }}>&quot;requested&quot;</span>
            <span style={{ color: "#8c8c99" }}>: </span>
            <span style={{ color: "#86efac" }}>&quot;this page&quot;</span>
            <span style={{ color: "#8c8c99" }}>,</span>{"\n"}
            {"  "}<span style={{ color: "#a5b4fc" }}>&quot;matched&quot;</span>
            <span style={{ color: "#8c8c99" }}>: </span>
            <span style={{ color: "#8c8c99" }}>[]</span>
            <span style={{ color: "#8c8c99" }}>,</span>{"\n"}
            {"  "}<span style={{ color: "#a5b4fc" }}>&quot;checkedFrom&quot;</span>
            <span style={{ color: "#8c8c99" }}>: </span>
            <span style={{ color: "#86efac" }}>&quot;router&quot;</span>{"\n"}
            <span style={{ color: "#8c8c99" }}>{"}"}</span>
          </pre>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/25 no-underline transition-all duration-200 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Go Home
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-foreground bg-transparent border border-border no-underline transition-all duration-200 hover:border-border-hover hover:bg-surface-hover active:scale-[0.97]"
          >
            View Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
