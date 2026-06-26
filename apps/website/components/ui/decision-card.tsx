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
  allowed: "decision-card-allowed",
  denied: "decision-card-denied",
  loading: "decision-card-loading",
  warning: "decision-card-warning",
  neutral: "decision-card-neutral",
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
    <div className={`decision-card ${statusToClass[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[13px] font-semibold m-0">{title}</h4>
        {badge && <Badge variant={statusToBadge[status]}>{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}
