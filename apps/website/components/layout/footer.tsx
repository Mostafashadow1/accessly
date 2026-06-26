"use client";

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
  { href: "https://github.com/accessly/accessly/discussions", label: "Roadmap", external: true },
];

const communityLinks = [
  { href: "https://github.com/accessly/accessly/discussions", label: "Discussions", external: true },
  { href: "#", label: "Discord", external: true },
  { href: "https://github.com/accessly/accessly/issues/new", label: "Report Issue", external: true },
  { href: "https://github.com/accessly/accessly/discussions/new", label: "Request Feature", external: true },
];

const trustBadges = [
  "React 18+",
  "Next.js",
  "TypeScript",
  "MIT",
  "Tree Shakeable",
  "SSR Ready",
  "~5kB gzip",
  "ESM + CJS",
];

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer role="contentinfo">
      {/* CTA Section */}
      <div className="section footer-cta">
        <div className="section-container text-center">
          <h2 className="section-header-title mb-3">
            Ready to simplify access control?
          </h2>
          <p className="text-secondary mb-6 text-[14px]">
            No install required. Try it with your backend and your permissions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/lab" className="cta-link">
              Try Accessly Lab
              <span aria-hidden="true" className="text-[16px]">→</span>
            </Link>
            <button
              onClick={() => navigator.clipboard.writeText("pnpm add accessly")}
              className="cta-copy-btn"
              aria-label="Copy install command"
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                pnpm add accessly
              </span>
              <span className="text-[14px]" aria-hidden="true">📋</span>
            </button>
          </div>
        </div>
      </div>

      {/* Link Columns */}
      <div className="section footer-columns">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Resources" links={resourceLinks} external />
            <FooterColumn title="Community" links={communityLinks} external />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="section-sm footer-badges">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="trust-badge">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-tertiary">
            <span>Accessly &copy; {currentYear}</span>
            <span>Built by Shadow Coding</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  external,
}: {
  title: string;
  links: { href: string; label: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <h3 className="footer-column-heading">{title}</h3>
      <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.label}>
            {external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="footer-link">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
