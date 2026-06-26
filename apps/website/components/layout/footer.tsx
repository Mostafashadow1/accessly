"use client";

import Link from "next/link";
import {
  productLinks,
  resourceLinks,
  communityLinks,
  trustBadges,
} from "@/data/navigation";

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
      <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted mb-4">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.label} className="p-0 m-0">
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted no-underline hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-muted no-underline hover:text-foreground transition-colors duration-150"
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
  return (
    <footer role="contentinfo" className="border-t border-border bg-[#09090b]">
      {/* Top Part: Logo and columns */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground no-underline">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-primary to-violet text-[10px] font-bold text-white shadow-sm shadow-primary/20">
                  A
                </span>
                <span className="font-sans font-medium tracking-tight">Accessly</span>
              </Link>
              <p className="text-xs text-muted leading-relaxed max-w-xs mt-2">
                Permission checks that explain themselves. Open-source, developer-first authorization for React.
              </p>
            </div>
            <div className="flex items-center gap-3.5 mt-6">
              <a
                href="https://github.com/accessly/accessly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Three Columns */}
          <div className="md:col-span-3 grid grid-cols-3 gap-8">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
            <FooterColumn title="Community" links={communityLinks} />
          </div>
        </div>
      </div>

      {/* Bottom row: badges, credits, and copyright */}
      <div className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex px-2.5 py-0.5 rounded text-[10px] font-semibold bg-surface text-muted border border-border-light"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Credits & copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-muted pt-6 sm:pt-0 border-t sm:border-t-0 border-border-light sm:pt-0">
            <span>&copy; {currentYear} Accessly</span>
            <span className="hidden sm:inline text-muted-dark">|</span>
            <span>
              Built by{" "}
              <a
                href="https://shadowcoding.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors no-underline font-semibold"
              >
                Shadow Coding
              </a>
            </span>
            <span className="hidden sm:inline text-muted-dark">|</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
