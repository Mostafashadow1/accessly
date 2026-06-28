import type { NavItem, FooterLink } from "@/types/navigation";
import { docsSidebarGroups } from "@/data/docs-architecture";

export const navLinks: NavItem[] = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/use-cases", label: "Use Cases" },
  { href: "/docs/ai", label: "AI Prompts" },
  { href: "/lab", label: "Lab" },
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
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/lab", label: "Lab" },
];

export const resourceLinks: FooterLink[] = [
  { href: "https://github.com/Mostafashadow1/accessly", label: "GitHub", external: true },
  { href: "https://www.npmjs.com/package/accessly", label: "npm", external: true },
];

export const docSidebarLinks = docsSidebarGroups;

export const trustBadges = [
  "React",
  "Next.js",
  "TypeScript",
  "MIT",
  "Tree-shakeable",
  "SSR Ready",
];
