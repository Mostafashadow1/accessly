"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";

const GitHubIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const NpmIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
  </svg>
);

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/82 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          : "border-transparent bg-background/35 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-current={isActive("/") ? "page" : undefined}
          className="group flex items-center gap-2.5 no-underline"
        >
          <span
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border shadow-[0_0_26px_rgba(124,92,255,0.22)] transition-all duration-200",
              isActive("/")
                ? "border-primary/45 bg-primary/10"
                : "border-primary/25 bg-primary/8 group-hover:border-primary/40 group-hover:bg-primary/12",
            )}
          >
            <Image
              src="/brand/accesly-logo.webp"
              alt="Accessly"
              width={300}
              height={300}
              className="h-full w-full"
              priority
            />
          </span>
          <span
            className={cn(
              "text-[15px] font-semibold tracking-tight transition-colors",
              isActive("/")
                ? "text-foreground"
                : "text-muted group-hover:text-foreground",
            )}
          >
            Accessly
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-border bg-surface/50 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium no-underline transition-all duration-150",
                isActive(link.href)
                  ? "bg-primary/12 text-accent shadow-[inset_0_0_0_1px_rgba(124,92,255,0.18)]"
                  : "text-muted hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="https://github.com/Mostafashadow1/accessly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted no-underline transition-all duration-150 hover:bg-surface-hover hover:text-foreground"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.npmjs.com/package/accessly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="npm"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted no-underline transition-all duration-150 hover:bg-surface-hover hover:text-foreground"
            >
              <NpmIcon />
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/65 text-muted transition-all duration-150 hover:border-border-hover hover:bg-surface-hover hover:text-foreground md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            )}
          </button>

          <Link
            href="/lab"
            className={cn(
              "hidden h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold no-underline transition-all duration-200 md:inline-flex",
              isActive("/lab")
                ? "border border-primary/30 bg-primary/16 text-accent shadow-[0_0_28px_rgba(124,92,255,0.18)]"
                : "bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(124,92,255,0.22)] hover:bg-primary-hover hover:shadow-[0_14px_34px_rgba(124,92,255,0.28)]",
            )}
          >
            Try Lab
            <ArrowIcon />
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/96 shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl md:hidden">
          <nav
            className="flex flex-col gap-1 px-5 py-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-all duration-150",
                  isActive(link.href)
                    ? "bg-primary/12 text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <a
                href="https://github.com/Mostafashadow1/accessly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted no-underline transition-all duration-150 hover:bg-surface-hover hover:text-foreground"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.npmjs.com/package/accessly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="npm"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted no-underline transition-all duration-150 hover:bg-surface-hover hover:text-foreground"
              >
                <NpmIcon />
              </a>
              <Link
                href="/lab"
                className={cn(
                  "ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold no-underline transition-all duration-200",
                  isActive("/lab")
                    ? "border border-primary/30 bg-primary/16 text-accent"
                    : "bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(124,92,255,0.22)] hover:bg-primary-hover",
                )}
              >
                Try Lab
                <ArrowIcon />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
