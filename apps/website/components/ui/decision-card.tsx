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
  allowed: "bg-success-bg border-success/20",
  denied: "bg-danger-bg border-danger/20",
  loading: "bg-info-bg border-info/20",
  warning: "bg-warning-bg border-warning/20",
  neutral: "bg-surface border-border",
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
        <h4 className="text-sm font-semibold m-0 text-foreground">{title}</h4>
        {badge && <Badge variant={statusToBadge[status]}>{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}
