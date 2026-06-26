import type { NavItem, FooterLink } from "@/types/navigation";

export const navLinks: NavItem[] = [
  { href: "/docs", label: "Docs" },
  { href: "/showcases", label: "Showcases" },
  { href: "/lab", label: "Lab" },
  { href: "/recipes", label: "Recipes" },
];

export const sidebarItems = [
  { label: "Playground", icon: "▶", active: true },
  { label: "Adapters", icon: "◈", active: false },
  { label: "AccessModel", icon: "◉", active: false },
  { label: "Inspector", icon: "◎", active: false },
  { label: "Permission Explorer", icon: "◐", active: false },
  { label: "Logs", icon: "☰", active: false },
] as const;

export const productLinks: FooterLink[] = [
  { href: "/lab", label: "Accessly Lab" },
  { href: "/docs", label: "Documentation" },
  { href: "/docs/api", label: "API Reference" },
  { href: "/recipes", label: "Recipes" },
  { href: "/showcases", label: "Examples" },
];

export const resourceLinks: FooterLink[] = [
  { href: "https://github.com/accessly/accessly", label: "GitHub", external: true },
  { href: "https://www.npmjs.com/package/accessly", label: "npm", external: true },
  { href: "https://github.com/accessly/accessly/releases", label: "Changelog", external: true },
  { href: "https://github.com/accessly/accessly/releases", label: "Releases", external: true },
];

export const communityLinks: FooterLink[] = [
  { href: "https://github.com/accessly/accessly/discussions", label: "Discussions", external: true },
  { href: "#", label: "Discord", external: true },
  { href: "https://github.com/accessly/accessly/issues/new", label: "Report Issue", external: true },
  { href: "https://github.com/accessly/accessly/discussions/new", label: "Request Feature", external: true },
];

export const docSidebarLinks = [
  { href: "/docs", label: "Getting Started" },
  { href: "/docs/core-concepts", label: "Core Concepts" },
  { href: "/docs/backend-adapters", label: "Backend Adapters" },
  { href: "/docs/api", label: "API Reference" },
];

export const trustBadges = [
  "React",
  "Next.js",
  "TypeScript",
  "MIT",
  "Tree-shakeable",
  "SSR Ready",
];
