import type React from "react";
import Link from "next/link";

const sidebarLinks = [
  { href: "/docs", label: "Getting Started" },
  { href: "/docs/core-concepts", label: "Core Concepts" },
  { href: "/docs/backend-adapters", label: "Backend Adapters" },
  { href: "/docs/api", label: "API Reference" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-canvas">
      <nav
        className="hidden md:flex flex-col w-60 shrink-0 p-6 border-r border-border bg-surface/30"
        aria-label="Documentation sidebar"
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-dark mb-5">
          Documentation
        </h2>
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-6 max-w-3xl">
        {children}
      </main>
    </div>
  );
}
