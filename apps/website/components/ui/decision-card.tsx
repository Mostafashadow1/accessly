import type { ReactNode } from "react";
import { Badge } from "./badge";

type DecisionStatus = "allowed" | "denied" | "loading" | "warning" | "neutral";

interface DecisionCardProps {
  status: DecisionStatus;
  title: string;
  children: ReactNode;
  badge?: string;
}

const statusToClass: Record<DecisionStatus, string> = {
  allowed: "bg-[var(--color-success-subtle)] border-[var(--color-success)]/20",
  denied: "bg-[var(--color-danger-subtle)] border-[var(--color-danger)]/20",
  loading: "bg-[var(--color-info-subtle)] border-[var(--color-info)]/20",
  warning: "bg-[var(--color-warning-subtle)] border-[var(--color-warning)]/20",
  neutral: "bg-[var(--color-surface)] border-[var(--color-border)]",
};

const statusToBadge: Record<DecisionStatus, "allowed" | "denied" | "info" | "warning" | "neutral"> = {
  allowed: "allowed",
  denied: "denied",
  loading: "info",
  warning: "warning",
  neutral: "neutral",
};

export function DecisionCard({ status, title, children, badge }: DecisionCardProps) {
  return (
    <div className={`rounded-lg p-4 border ${statusToClass[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold m-0 text-[var(--color-text-primary)]">{title}</h4>
        {badge && <Badge variant={statusToBadge[status]}>{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}
