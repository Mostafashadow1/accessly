"use client";

import type { LabDecision, BackendId } from "@/types/lab";
import { BACKEND_PRESETS } from "@/data/lab-examples";

interface ResultSummaryProps {
  decision: LabDecision | null;
  backendId: BackendId;
  isVisible: boolean;
}

export function ResultSummary({
  decision,
  backendId,
  isVisible,
}: ResultSummaryProps) {
  if (!isVisible || !decision) return null;

  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);
  const backendName = backend?.name ?? "Unknown";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          Result
        </label>
        <button
          type="button"
          onClick={() => {
            /* Copy result to clipboard */
            navigator.clipboard.writeText(
              JSON.stringify(
                {
                  permission: decision.permission,
                  granted: decision.granted,
                  explanation: decision.explanation,
                  matched: decision.matched,
                  source: decision.source,
                  timing: `${decision.timing}ms`,
                },
                null,
                2,
              ),
            );
          }}
          className="text-[9px] px-1.5 py-0.5 rounded bg-surface/40 border border-border/15 text-muted-dark hover:text-foreground transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Verdict banner */}
      <div
        className={`
          rounded-xl border p-4 mb-3 transition-all duration-500
          ${
            decision.granted
              ? "bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
              : "bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5"
          }
        `}
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-lg font-bold ${
              decision.granted ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {decision.title}
          </span>
          <span className="text-xs font-mono text-muted-dark/60">
            {decision.permission}
          </span>
        </div>

        <p className="text-xs text-muted-dark leading-relaxed">
          {decision.explanation}
        </p>
      </div>

      <div className="mb-3 rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
        <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-1.5">
          Decision path
        </div>
        <dl className="space-y-1 text-[11px] leading-5">
          <DecisionDetail label="Requested permission" value={decision.details.requestedPermission} />
          {decision.source === "direct" && (
            <>
              <DecisionDetail label="Source" value="normalized backend permissions" />
              <DecisionDetail label="Matched permission" value={decision.details.matchedPermission} />
            </>
          )}
          {decision.source === "role_expansion" && (
            <>
              <DecisionDetail label="Role" value={decision.details.role ?? "unknown"} />
              <DecisionDetail label="Granted by" value={decision.details.grantedBy ?? "rolePermissions"} />
              <DecisionDetail label="Matched permission" value={decision.details.matchedPermission} />
            </>
          )}
          {decision.source === "wildcard" && (
            <>
              <DecisionDetail label="Wildcard matched" value={decision.details.wildcardMatched ?? decision.matched} />
              <DecisionDetail label="Source" value={decision.details.source} />
            </>
          )}
          {decision.source === "missing" && (
            <>
              <DecisionDetail label="Raw permissions" value="Not found" />
              <DecisionDetail label="Role-expanded permissions" value="Not found" />
              <DecisionDetail label="Wildcard permissions" value="Not matched" />
            </>
          )}
        </dl>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
          <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-0.5">
            Matched
          </div>
          <div className="text-xs font-mono text-foreground truncate">
            {decision.matched}
          </div>
        </div>
        <div className="rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
          <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-0.5">
            Source
          </div>
          <div className="text-xs font-mono text-foreground truncate">
            {decision.source}
          </div>
        </div>
        <div className="rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
          <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-0.5">
            Match Type
          </div>
          <div className="text-xs text-foreground">
            {decision.direct
              ? "Direct"
              : decision.wildcardMatch
                ? "Wildcard"
                : "Role Expansion"}
          </div>
        </div>
        <div className="rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
          <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-0.5">
            Timing
          </div>
          <div className="text-xs font-mono text-foreground">
            {decision.timing}ms
          </div>
        </div>
      </div>

      {/* Wildcard details */}
      {decision.wildcardMatch && decision.wildcards.length > 0 && (
        <div className="mt-2 rounded-lg bg-amber-500/5 border border-amber-500/15 px-3 py-2">
          <div className="text-[9px] text-amber-400/70 uppercase tracking-wider mb-1">
            Wildcard Expansion
          </div>
          <div className="flex flex-wrap gap-1">
            {decision.wildcards.map((w) => (
              <span
                key={w}
                className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-dark">{label}</dt>
      <dd className="text-right font-mono text-foreground">{value}</dd>
    </div>
  );
}
