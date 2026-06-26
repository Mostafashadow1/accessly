/**
 * Utility to conditionally join class names together.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
