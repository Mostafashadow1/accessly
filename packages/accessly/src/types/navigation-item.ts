export type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;
  any?: string[];
  all?: string[];
  flag?: string;
  children?: NavigationItem[];
};

