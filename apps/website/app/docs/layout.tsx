import type React from "react";
import { DocsSidebarNav } from "@/components/docs/docs-sidebar-nav";
import { docSidebarLinks } from "@/data/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-canvas relative">
      {/* Subtle background glows */}
      <div
        aria-hidden="true"
        className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(99,102,241,0.03)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-20 left-[20%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(139,92,246,0.025)" }}
      />

      {/* Desktop sidebar — Server Component shell, nav is client */}
      <aside className="hidden lg:flex flex-col w-[230px] shrink-0 border-r border-border bg-[#08080a]/50 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2.5 px-2 mb-5">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[glowPulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Documentation
            </h2>
          </div>
          <DocsSidebarNav links={docSidebarLinks} variant="sidebar" />
        </div>
      </aside>

      {/* Mobile horizontal pill nav */}
      <div className="lg:hidden w-full overflow-x-auto px-6 pt-4 pb-2 sticky top-14 z-10 bg-canvas/90 backdrop-blur-xl border-b border-border">
        <DocsSidebarNav links={docSidebarLinks} variant="pills" />
      </div>

      {/* Main content */}
      <main className="flex-1 py-14 md:py-20 px-6 md:px-14 max-w-4xl relative z-10">
        {children}
      </main>
    </div>
  );
}
