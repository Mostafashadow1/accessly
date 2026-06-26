"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docSidebarLinks } from "@/data/navigation";

export function DocsSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[220px] shrink-0 border-r border-border bg-[#08080a]/40 backdrop-blur-xl sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto p-6">
        <div className="flex items-center gap-2 mb-5 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[glowPulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">
            Documentation
          </h2>
        </div>
        <nav aria-label="Documentation sidebar">
          <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
            {docSidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 text-sm font-medium transition-all duration-200 no-underline rounded-r-md ${
                      isActive
                        ? "text-foreground font-semibold border-l-2 border-primary pl-3"
                        : "text-muted hover:text-foreground border-l-2 border-transparent pl-[14px] hover:border-border"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile sidebar — horizontal scrollable pills */}
      <div className="lg:hidden w-full overflow-x-auto px-6 pt-4 pb-2 sticky top-14 z-10 bg-canvas/90 backdrop-blur-xl border-b border-border">
        <nav
          className="flex gap-2 min-w-max pb-1"
          aria-label="Documentation pages"
        >
          {docSidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 text-accent border border-primary/20"
                    : "bg-surface text-muted border border-border hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
