import type { ReactNode } from "react";

type BadgeVariant = "default" | "allowed" | "denied" | "warning" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-surface text-muted border border-border",
  allowed: "bg-success-bg text-success border border-success/20",
  denied: "bg-danger-bg text-danger border border-danger/20",
  warning: "bg-warning-bg text-warning border border-warning/20",
  info: "bg-info-bg text-info border border-info/20",
  neutral: "bg-surface text-muted-dark border border-border",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold ${variantClass[variant]}`}
    >
      {children}
    </span>
  );
}
