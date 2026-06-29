import Link from "next/link";
import Image from "next/image";
import { productLinks, resourceLinks, trustBadges } from "@/data/navigation";

const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    href: "https://github.com/Mostafashadow1/accessly",
    label: "GitHub",
    icon: <GitHubIcon />,
  },
  {
    href: "https://www.npmjs.com/package/accessly",
    label: "npm",
    icon: <NpmIcon />,
  },
];

const quickActions = [
  { href: "/lab", label: "Open Lab", description: "Test a permission flow" },
  { href: "/docs", label: "Read Docs", description: "Start the integration" },
];

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-4.464l.01-9.387H9.594l-.009 9.378H5.13z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h6v6" />
      <path d="M12 4 5 11" />
    </svg>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-dark">
        {title}
      </h4>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {links.map((link) => (
          <li key={link.label} className="m-0 p-0">
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 py-1 text-sm text-muted no-underline transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
                <span className="text-muted-dark transition-colors duration-150 group-hover:text-accent">
                  <ExternalIcon />
                </span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="inline-flex py-1 text-sm text-muted no-underline transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-[linear-gradient(180deg,rgba(16,17,22,0.74),var(--color-background))]"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 md:py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="flex flex-col gap-7">
            <div>
              <Link
                href="/"
                className="group inline-flex items-center gap-3 text-foreground no-underline"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-primary/25 bg-primary/8 shadow-[0_0_28px_rgba(124,92,255,0.20)] transition-all duration-200 group-hover:border-primary/45 group-hover:bg-primary/12">
                  <Image
                    src="/brand/accesly-logo.webp"
                    alt="Accessly"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="text-base font-semibold">Accessly</span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-dark">
                    Explainable access control
                  </span>
                </span>
              </Link>

              <p className="mt-5 max-w-[520px] text-sm leading-6 text-muted">
                A small React permission layer for rendering UI from an
                inspectable access model, with adapters for real backend
                shapes.
              </p>
            </div>

            <div className="grid max-w-[620px] gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex min-h-[72px] items-center justify-between gap-4 rounded-lg border border-border bg-surface/45 px-4 py-3 no-underline transition-all duration-200 hover:border-primary/25 hover:bg-primary/[0.035]"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {action.description}
                    </span>
                  </span>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/55 text-muted transition-all duration-200 group-hover:border-primary/25 group-hover:text-accent">
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-[1fr_1fr_auto] lg:justify-end">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />

            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-dark">
                Package
              </h4>
              <div className="flex flex-wrap items-center gap-2 sm:max-w-[180px]">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex rounded-md border border-border bg-surface/45 px-2.5 py-1 text-[11px] font-medium text-muted"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/45">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span>&copy; {currentYear} Accessly</span>
            <span className="text-muted-dark" aria-hidden="true">
              /
            </span>
            <span>MIT License</span>
            <span className="text-muted-dark" aria-hidden="true">
              /
            </span>
            <span>
              Built by{" "}
              <a
                href="https://shadowcoding.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground no-underline transition-colors duration-150 hover:text-accent"
              >
                Shadow Coding
              </a>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-muted no-underline transition-all duration-150 hover:border-border-hover hover:bg-surface-hover hover:text-foreground"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
