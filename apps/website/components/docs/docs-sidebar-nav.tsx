"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/navigation";

interface DocsSidebarNavProps {
  links: NavItem[];
  variant: "sidebar" | "pills";
}

/**
 * DocsSidebarNav — the only client component in the docs shell.
 * Needs "use client" solely for usePathname() to highlight the active link.
 */
export function DocsSidebarNav({ links, variant }: DocsSidebarNavProps) {
  const pathname = usePathname();

  if (variant === "pills") {
    return (
      <nav className="flex gap-2 min-w-max pb-1" aria-label="Documentation pages">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-4 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-accent border border-primary/25"
                  : "bg-surface text-muted border border-border hover:text-foreground hover:border-border/80"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  /* variant === "sidebar" */
  return (
    <nav aria-label="Documentation sidebar">
      <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`block py-2 text-[13px] font-medium transition-all duration-150 no-underline rounded-md ${
                  isActive
                    ? "text-foreground font-semibold bg-primary/[0.06] border-l-2 border-primary pl-3 pr-2"
                    : "text-muted hover:text-foreground border-l-2 border-transparent pl-[14px] pr-2 hover:border-border hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
