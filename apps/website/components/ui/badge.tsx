import type { ReactNode } from "react";

type BadgeVariant = "default" | "allowed" | "denied" | "warning" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  default: "badge-default",
  allowed: "badge-allowed",
  denied: "badge-denied",
  warning: "badge-warning",
  info: "badge-info",
  neutral: "badge-neutral",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span className={`badge ${variantClass[variant]}`}>
      {children}
    </span>
  );
}
