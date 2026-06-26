"use client";

import { useState } from "react";
import Link from "next/link";

const productLinks = [
  { href: "/lab", label: "Accessly Lab" },
  { href: "/docs", label: "Documentation" },
  { href: "/docs/api", label: "API Reference" },
  { href: "/recipes", label: "Recipes" },
  { href: "/showcases", label: "Examples" },
];

const resourceLinks = [
  { href: "https://github.com/accessly/accessly", label: "GitHub", external: true },
  { href: "https://www.npmjs.com/package/accessly", label: "npm", external: true },
  { href: "https://github.com/accessly/accessly/releases", label: "Changelog", external: true },
  { href: "https://github.com/accessly/accessly/releases", label: "Releases", external: true },
];

const communityLinks = [
  { href: "https://github.com/accessly/accessly/discussions", label: "Discussions", external: true },
  { href: "#", label: "Discord", external: true },
  { href: "https://github.com/accessly/accessly/issues/new", label: "Report Issue", external: true },
  { href: "https://github.com/accessly/accessly/discussions/new", label: "Request Feature", external: true },
];

const trustBadges = [
  "React",
  "Next.js",
  "TypeScript",
  "MIT",
  "SSR Ready",
  "Tree-shakeable",
];

const currentYear = new Date().getFullYear();

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-dark mb-4">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted no-underline hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-muted no-underline hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [installCopied, setInstallCopied] = useState(false);

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 1500);
  };

  return (
    <footer role="contentinfo" className="border-t border-border bg-canvas">
      {/* Link Columns */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-base font-semibold text-foreground no-underline mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet text-xs font-bold text-white shadow-sm shadow-primary/20">
                A
              </span>
              Accessly
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Permission checks that explain themselves. Open-source access control for React.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/accessly/accessly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/accessly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
                aria-label="npm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
                </svg>
              </a>
            </div>
          </div>
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Community" links={communityLinks} />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface text-muted border border-border"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-dark">
            <span>Accessly &copy; {currentYear}</span>
            <span className="flex items-center gap-1">
              Built by <a href="https://shadowcoding.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground no-underline">Shadow Coding</a>
            </span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
