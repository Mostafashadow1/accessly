/* ── Navigation Types ── */

export interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

export interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export interface NavGroup {
  title: string;
  links: NavItem[];
}
