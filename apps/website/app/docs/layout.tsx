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
    <div className="flex" style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-primary)" }}>
      <nav
        className="hide-mobile flex-col"
        style={{
          width: "15rem",
          flexShrink: 0,
          padding: "var(--space-xl) var(--space-lg)",
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-elevated)",
        }}
        aria-label="Documentation sidebar"
      >
        <h2 className="text-xs font-semibold uppercase mb-md text-muted" style={{ letterSpacing: "0.08em" }}>
          Documentation
        </h2>
        <ul className="flex flex-col gap-1 list-none">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block text-base font-medium text-secondary hover-text-primary"
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  transition: "background var(--transition-fast), color var(--transition-fast)",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-lg" style={{ maxWidth: "48rem" }}>
        {children}
      </main>
    </div>
  );
}
