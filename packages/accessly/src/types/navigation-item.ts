export type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;
  children?: NavigationItem[];
};
