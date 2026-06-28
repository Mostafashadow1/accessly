"use client";

import type { LabDecision, BackendId } from "@/types/lab";
import { BACKEND_PRESETS } from "@/data/lab-examples";

interface ReactUiPreviewProps {
  decision: LabDecision | null;
  isVisible: boolean;
  backendId: BackendId;
  permission: string;
}

const EXAMPLE_ACTIONS = [
  { id: "read", label: "Read repositories", permission: "repositories.read", icon: "📖" },
  { id: "write", label: "Write to repository", permission: "repositories.write", icon: "✏️" },
  { id: "delete", label: "Delete repository", permission: "repositories.delete", icon: "🗑️" },
  { id: "billing", label: "View billing", permission: "billing.view", icon: "💰" },
  { id: "settings", label: "Manage settings", permission: "settings.manage", icon: "⚙️" },
  { id: "users", label: "Manage users", permission: "users.manage", icon: "👥" },
];

export function ReactUiPreview({
  decision,
  isVisible,
  backendId,
  permission,
}: ReactUiPreviewProps) {
  if (!isVisible || !decision) return null;

  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);
  const backendName = backend?.name ?? "Unknown";

  const relevantActions = EXAMPLE_ACTIONS.filter(
    (a) => a.permission === permission || Math.random() > 0.5,
  ).slice(0, 4);

  const hasPermission = (perm: string) => {
    if (perm === permission) return decision.granted;
    return backend?.permissions.includes(perm) ?? false;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          UI Preview
        </label>
        <span className="text-[9px] text-muted-dark/50">
          {backendName} · <span className={decision.granted ? "text-emerald-400" : "text-red-400"}>{decision.granted ? "allowed" : "denied"}</span>
        </span>
      </div>

      {/* Simulated React component */}
      <div className="rounded-xl border border-border/15 bg-surface/5 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border/10">
          <div className="text-sm font-semibold text-foreground">
            Repository Dashboard
          </div>
          <div className="text-[10px] text-muted-dark/60 mt-0.5">
            Actions for current user
          </div>
        </div>

        {/* Actions list */}
        <div className="px-4 py-3 space-y-1.5">
          {relevantActions.map((action) => {
            const allowed = hasPermission(action.permission);
            return (
              <div
                key={action.id}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-xs
                  transition-all duration-300
                  ${allowed ? "bg-surface/30 hover:bg-surface/50 cursor-pointer" : "bg-surface/5 opacity-40 cursor-not-allowed"}
                `}
              >
                <span className="text-sm">{action.icon}</span>
                <span
                  className={`flex-1 ${allowed ? "text-foreground" : "text-muted-dark"}`}
                >
                  {action.label}
                </span>
                {allowed ? (
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    allowed
                  </span>
                ) : (
                  <span className="text-[9px] text-muted-dark bg-surface-2/50 px-1.5 py-0.5 rounded-full">
                    denied
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Code snippet */}
        <div className="px-4 py-2.5 bg-surface/20 border-t border-border/10">
          <div className="text-[9px] text-muted-dark/40 font-mono mb-1">
            {`// Equivalent React code`}
          </div>
          <pre className="text-[10px] font-mono text-muted-dark/60 leading-relaxed">
            <span className="text-primary/60">{`<Can`}</span>{` `}
            <span className="text-amber-400/60">permission</span>
            {`="`}
            <span className="text-emerald-400/60">{permission}</span>
            {`">`}{"\n"}
            {`  `}<span className="text-muted-dark/40">{`<CreateButton />`}</span>{"\n"}
            <span className="text-primary/60">{`</Can>`}</span>
          </pre>
        </div>
      </div>
    </div>
  );
}
