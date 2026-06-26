"use client";

import Link from "next/link";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/showcases", label: "Showcases" },
  { href: "/lab", label: "Lab" },
  { href: "/recipes", label: "Recipes" },
];

export function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-mark">A</span>
          Accessly
        </Link>

        <div className="flex items-center gap-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-link"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-xs">
            <a
              href="https://github.com/accessly/accessly"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-icon-btn"
              aria-label="GitHub repository"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="https://www.npmjs.com/package/accessly"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-icon-btn"
              aria-label="npm package"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
