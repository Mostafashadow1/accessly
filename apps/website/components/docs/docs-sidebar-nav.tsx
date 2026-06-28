"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/types/navigation";
import { cn } from "@/lib/cn";

interface DocsSidebarNavProps {
  links: NavGroup[];
  variant: "sidebar" | "pills";
}

/**
 * DocsSidebarNav — the only client component in the docs shell.
 * Needs "use client" solely for usePathname() to highlight the active link.
 */
export function DocsSidebarNav({ links, variant }: DocsSidebarNavProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const flatLinks = useMemo(() => links.flatMap((group) => group.links), [links]);

  useEffect(() => {
    const hashLinks = flatLinks
      .map((link) => link.href.split("#")[1])
      .filter((hash): hash is string => Boolean(hash));
    const sectionElements = hashLinks
      .map((hash) => document.getElementById(hash))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) return;

    let frame = 0;

    const updateActiveSection = () => {
      const viewportOffset = 140;
      const currentSection =
        sectionElements
          .filter(
            (element) =>
              element.getBoundingClientRect().top - viewportOffset <= 0,
          )
          .at(-1) ?? sectionElements[0];

      setActiveHash(currentSection.id);
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    const updateFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hashLinks.includes(hash)) {
        setActiveHash(hash);
        return;
      }

      requestUpdate();
    };

    updateFromHash();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [flatLinks]);

  const isLinkActive = (href: string) => {
    const [path, hash] = href.split("#");
    const hrefPath = path || pathname;
    const pathMatches = pathname === hrefPath;

    if (!pathMatches) return false;
    if (!hash) return true;
    return activeHash === hash;
  };

  const handleLinkClick = (href: string) => {
    const hash = href.split("#")[1];
    if (hash) setActiveHash(hash);
  };

  if (variant === "pills") {
    return (
      <nav className="flex gap-2 min-w-max pb-1" aria-label="Documentation pages">
        {flatLinks.map((link) => {
          const isActive = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleLinkClick(link.href)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-all duration-150 border",
                isActive
                  ? "bg-primary/10 text-accent border-primary/25"
                  : "bg-surface/60 text-muted border-border hover:text-foreground hover:border-border-hover",
              )}
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
    <nav aria-label="Documentation sidebar" className="space-y-7">
      {links.map((group) => (
        <section key={group.title}>
          <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-dark">
            {group.title}
          </h3>
          <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
            {group.links.map((link) => {
              const isActive = isLinkActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex items-center justify-between gap-3 py-1.5 text-[13px] font-medium transition-all duration-150 no-underline rounded-md border-l-2",
                      isActive
                        ? "text-accent bg-primary/[0.055] border-primary/70 pl-3 pr-2"
                        : "text-muted hover:text-foreground border-transparent pl-[14px] pr-2 hover:border-border-hover hover:bg-surface-hover",
                    )}
                  >
                    <span className="truncate">{link.label}</span>
                    {link.badge ? (
                      <span className="shrink-0 rounded-md border border-border bg-surface-2/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-dark">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
