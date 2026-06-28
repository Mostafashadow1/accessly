"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/showcases") return pathname === "/showcases";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-[rgba(8,8,10,0.85)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between h-14 max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline opacity-95 hover:opacity-100 transition-opacity"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-[7px] bg-gradient-to-br from-primary to-violet text-[11px] font-extrabold text-white shadow-md shadow-primary/30">
            A
          </span>
          <span className="text-[15px] font-semibold text-foreground tracking-tight">
            Accessly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex text-sm font-medium no-underline transition-all duration-150 ${
                isActive(link.href)
                  ? "text-foreground font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: icons + CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            <a
              href="https://github.com/accessly/accessly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150 no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="https://www.npmjs.com/package/accessly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="npm"
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150 no-underline"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            )}
          </button>

          {/* Desktop CTA */}
          <Link
            href="/showcases"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/25 no-underline transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            Try Lab
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-[rgba(8,8,10,0.97)] backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2.5 px-3 rounded-lg text-sm font-medium no-underline transition-all duration-150 ${
                  isActive(link.href)
                    ? "text-foreground font-semibold bg-primary-light"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
              <a
                href="https://github.com/accessly/accessly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150 no-underline"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/accessly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="npm"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150 no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
                </svg>
              </a>
              <Link
                href="/showcases"
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/25 no-underline transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Try Lab
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
