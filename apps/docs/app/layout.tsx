"use client";

import React from "react";

const navItems = [
  { href: "/", label: "Getting Started" },
  { href: "/core-concepts", label: "Core Concepts" },
  { href: "/backend-adapters", label: "Backend Adapters" },
  { href: "/explain-engine", label: "Explain Engine" },
  { href: "/api", label: "API Reference" },
  { href: "/showcases", label: "Showcases" },
  { href: "/recipes", label: "Recipes" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <title>Accessly Docs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <nav
            style={{
              width: 260,
              background: "#f4f5f7",
              borderRight: "1px solid #ddd",
              padding: "1.5rem",
              flexShrink: 0,
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Accessly</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {navItems.map((item) => (
                <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href={item.href}
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <main style={{ flex: 1, padding: "2rem", maxWidth: 800 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
