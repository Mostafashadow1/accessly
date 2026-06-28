import type { ReactNode } from "react";

type BadgeVariant = "default" | "allowed" | "denied" | "warning" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  allowed: "bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-[var(--color-success)]/20",
  denied: "bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border border-[var(--color-danger)]/20",
  warning: "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border border-[var(--color-warning)]/20",
  info: "bg-[var(--color-info-subtle)] text-[var(--color-info)] border border-[var(--color-info)]/20",
  neutral: "bg-[var(--color-surface)] text-[var(--color-text-muted-foreground)] border border-[var(--color-border)]",
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
