import type React from "react";
import { DocsSidebarNav } from "@/components/docs/docs-sidebar-nav";
import { docSidebarLinks } from "@/data/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col bg-canvas lg:flex-row">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(124,92,255,0.055), transparent)",
        }}
      />

      <aside className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-border bg-background/65 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto backdrop-blur-xl">
        <div className="p-6 pb-3">
          <div className="flex items-center gap-2.5 px-2 mb-5">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-primary/70"
            />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Documentation
            </h2>
          </div>
          <DocsSidebarNav links={docSidebarLinks} variant="sidebar" />
        </div>
      </aside>

      <div className="lg:hidden w-full overflow-x-auto px-6 pt-4 pb-2 sticky top-14 z-10 bg-canvas/90 backdrop-blur-xl border-b border-border">
        <DocsSidebarNav links={docSidebarLinks} variant="pills" />
      </div>

      <main className="flex-1 py-14 md:py-20 px-6 md:px-10 xl:px-14 relative z-10 min-w-0">
        {children}
      </main>
    </div>
  );
}
