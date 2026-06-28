"use client";

import { useState } from "react";
import type { LabDecision, BackendId } from "@/types/lab";
import { BACKEND_PRESETS } from "@/data/lab-examples";

interface InspectorTabsProps {
  decision: LabDecision | null;
  backendId: BackendId;
  jsonText: string;
  isVisible: boolean;
}

type InspectorTab = "decision" | "accessmodel" | "trace" | "logs";

const TABS: { id: InspectorTab; label: string }[] = [
  { id: "decision", label: "Decision" },
  { id: "accessmodel", label: "AccessModel" },
  { id: "trace", label: "Trace" },
  { id: "logs", label: "Logs" },
];

export function InspectorTabs({
  decision,
  backendId,
  jsonText,
  isVisible,
}: InspectorTabsProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("decision");

  if (!isVisible) return null;

  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);

  // Parse the JSON to build a mock AccessModel
  let parsedPayload: Record<string, unknown> | null = null;
  try {
    parsedPayload = JSON.parse(jsonText);
  } catch {
    // ignore parse errors
  }

  const accessModel = parsedPayload
    ? buildAccessModel(parsedPayload)
    : null;

  const logs = buildLogs(decision, backendId);

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 rounded-lg bg-surface/30 border border-border/10 p-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-dark hover:text-foreground"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Decision Tab */}
      {activeTab === "decision" && (
        <div className="space-y-3">
          <InspectorSection title="Decision Result">
            <div className="grid grid-cols-2 gap-2">
              <InspectorField
                label="Granted"
                value={decision?.granted ? "true" : "false"}
                color={decision?.granted ? "emerald" : "red"}
              />
              <InspectorField
                label="Permission"
                value={decision?.permission ?? "—"}
              />
              <InspectorField
                label="Matched By"
                value={decision?.matched ?? "—"}
              />
              <InspectorField
                label="Source"
                value={decision?.source ?? "—"}
              />
              <InspectorField
                label="Match Type"
                value={
                  decision?.direct
                    ? "direct"
                    : decision?.wildcardMatch
                      ? "wildcard"
                      : "role"
                }
              />
              <InspectorField
                label="Timing"
                value={decision ? `${decision.timing}ms` : "—"}
              />
            </div>
          </InspectorSection>

          <InspectorSection title="Explanation">
            <p className="text-xs text-muted-dark leading-relaxed">
              {decision?.explanation ?? "No decision yet."}
            </p>
          </InspectorSection>

          {decision?.wildcardMatch && decision.wildcards.length > 0 && (
            <InspectorSection title="Wildcard Matches">
              <div className="flex flex-wrap gap-1">
                {decision.wildcards.map((w) => (
                  <code
                    key={w}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono"
                  >
                    {w}
                  </code>
                ))}
              </div>
            </InspectorSection>
          )}
        </div>
      )}

      {/* AccessModel Tab */}
      {activeTab === "accessmodel" && (
        <div className="space-y-3">
          {accessModel ? (
            <>
              <InspectorSection title="User Context">
                <div className="grid grid-cols-2 gap-2">
                  <InspectorField
                    label="ID"
                    value={accessModel.user?.id ?? "—"}
                  />
                  <InspectorField
                    label="Roles"
                    value={accessModel.user?.roles?.join(", ") ?? "—"}
                  />
                </div>
              </InspectorSection>

              <InspectorSection title={`Permissions (${accessModel.permissions.length})`}>
                <div className="flex flex-wrap gap-1">
                  {accessModel.permissions.map((p) => (
                    <code
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-primary/5 text-primary/80 font-mono"
                    >
                      {p}
                    </code>
                  ))}
                </div>
              </InspectorSection>

              <InspectorSection title="Raw AccessModel JSON">
                <pre className="text-[10px] font-mono text-muted-dark leading-relaxed bg-surface/20 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(accessModel, null, 2)}
                </pre>
              </InspectorSection>
            </>
          ) : (
            <div className="text-xs text-muted-dark/60 py-4 text-center">
              Parse valid JSON to see the AccessModel preview.
            </div>
          )}
        </div>
      )}

      {/* Trace Tab */}
      {activeTab === "trace" && (
        <div className="space-y-3">
          <InspectorSection title="Resolution Trace">
            <div className="font-mono text-[10px] text-muted-dark leading-relaxed space-y-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-2 py-1 rounded hover:bg-surface/20"
                >
                  <span className="shrink-0 text-[9px] text-muted-dark/40 tabular-nums w-8 text-right">
                    {log.time}
                  </span>
                  <span className="shrink-0">{log.icon}</span>
                  <span className="text-foreground/80">{log.message}</span>
                </div>
              ))}
            </div>
          </InspectorSection>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="space-y-3">
          <InspectorSection title="Full Log">
            <div className="font-mono text-[10px] text-muted-dark leading-relaxed bg-black/20 rounded-lg p-3 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <span className="text-muted-dark/40">Run a check to see logs.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 py-0.5">
                    <span className="shrink-0 text-muted-dark/30 tabular-nums w-8 text-right">
                      {log.time}
                    </span>
                    <span className="shrink-0">{log.icon}</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </InspectorSection>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-muted-dark uppercase tracking-wider mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function InspectorField({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "emerald" | "red";
}) {
  return (
    <div className="rounded-lg bg-surface/20 border border-border/10 px-3 py-2">
      <div className="text-[9px] text-muted-dark/50 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div
        className={`text-xs font-mono truncate ${
          color === "emerald"
            ? "text-emerald-400"
            : color === "red"
              ? "text-red-400"
              : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ── Helpers ── */

function buildAccessModel(payload: Record<string, unknown>) {
  // Try to extract permissions from common patterns
  let permissions: string[] = [];
  let userId = "unknown";
  let roles: string[] = [];

  if (Array.isArray(payload.all_permissions)) {
    permissions = payload.all_permissions as string[];
  } else if (Array.isArray(payload.abilities)) {
    permissions = payload.abilities as string[];
  } else if (Array.isArray(payload.permissions)) {
    permissions = payload.permissions as string[];
  } else if (Array.isArray(payload.authorities)) {
    permissions = (payload.authorities as { authority?: string }[]).map(
      (a) => a.authority ?? "",
    ).filter(Boolean);
  } else if (Array.isArray(payload.claims)) {
    permissions = (payload.claims as { type?: string; value?: string }[])
      .filter((c) => c.type === "permission")
      .map((c) => c.value ?? "")
      .filter(Boolean);
  } else if (
    payload.user &&
    typeof payload.user === "object" &&
    !Array.isArray(payload.user)
  ) {
    const u = payload.user as Record<string, unknown>;
    if (Array.isArray(u.permissions)) {
      permissions = u.permissions as string[];
    }
    if (Array.isArray(u.abilities)) {
      permissions = u.abilities as string[];
    }
  }

  // Extract user info
  if (payload.user && typeof payload.user === "object" && !Array.isArray(payload.user)) {
    const u = payload.user as Record<string, unknown>;
    userId = (u.id as string) ?? "unknown";
    roles = (u.roles as string[]) ?? [];
  } else {
    userId = (payload.sub as string) ?? (payload.nameid as string) ?? "unknown";
    if (Array.isArray(payload.role)) {
      roles = payload.role as string[];
    } else if (Array.isArray(payload.roles)) {
      roles = payload.roles as string[];
    }
  }

  return {
    user: { id: userId, roles },
    permissions,
  };
}

function buildLogs(
  decision: LabDecision | null,
  backendId: BackendId,
): { time: string; icon: string; message: string }[] {
  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);
  const logs: { time: string; icon: string; message: string }[] = [];

  logs.push({ time: "00ms", icon: "📥", message: `Backend response received (${backend?.name ?? "Unknown"} format)` });
  logs.push({ time: "02ms", icon: "🔄", message: `Adapter: ${backend?.name ?? "Unknown"} adapter normalizing payload` });
  logs.push({ time: "04ms", icon: "📋", message: "AccessModel generated" });

  if (decision) {
    logs.push({ time: "06ms", icon: "🔍", message: `Checking permission: ${decision.permission}` });
    logs.push({ time: "08ms", icon: "⚖️", message: `Decision: ${decision.granted ? "ALLOWED" : "DENIED"} (${decision.direct ? "direct match" : decision.wildcardMatch ? "wildcard match" : "role expansion"})` });
    logs.push({ time: "10ms", icon: "🖥️", message: `React UI updated — ${decision.granted ? "rendering" : "hiding"} <Can> content` });
  }

  return logs;
}
