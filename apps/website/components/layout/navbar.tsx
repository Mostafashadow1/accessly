"use client";

import Link from "next/link";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/showcases", label: "Showcases" },
  { href: "/lab", label: "Lab" },
  { href: "/recipes", label: "Recipes" },
];

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 bg-canvas/70 backdrop-blur-xl border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold text-foreground no-underline hover:opacity-80 transition-opacity">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet text-xs font-bold text-white shadow-sm shadow-primary/20">
            A
          </span>
          <span>Accessly</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium text-muted no-underline hover:text-foreground transition-colors rounded-md hover:bg-surface-hover"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-0.5 ml-2">
            <a
              href="https://github.com/accessly/accessly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="GitHub repository"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="https://www.npmjs.com/package/accessly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="npm package"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
              </svg>
            </a>
          </div>

          <Link
            href="/lab"
            className="ml-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-violet shadow-sm shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
          >
            Lab
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
