"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { PermissionProvider } from "accessly";
import type { AccessModel } from "accessly";
import type { LabMode, BackendId, LabDecision } from "@/types/lab";
import { BACKEND_PRESETS, COMMON_PERMISSIONS as COMMON_PERMS_DATA } from "@/data/lab-examples";
import { LabModeTabs } from "./lab-mode-tabs";
import { BackendSelector } from "./backend-selector";
import { BackendJsonEditor } from "./backend-json-editor";
import { PermissionCommand } from "./permission-command";
import { DecisionReplay } from "./decision-replay";
import { ResultSummary } from "./result-summary";
import { ReactUiPreview } from "./react-ui-preview";
import { InspectorTabs } from "./inspector-tabs";
import { RecipeGallery } from "./recipe-gallery";

export function LabShell() {
  /* ── Mode ── */
  const [mode, setMode] = useState<LabMode>("playground");

  /* ── Playground State ── */
  const [selectedBackend, setSelectedBackend] = useState<BackendId>("laravel");
  const [jsonText, setJsonText] = useState("");
  const [permissionQuery, setPermissionQuery] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [pipelineActive, setPipelineActive] = useState(-1);
  const [pipelineDone, setPipelineDone] = useState(false);
  const [decision, setDecision] = useState<LabDecision | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const pipelineTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const backend = BACKEND_PRESETS.find((b) => b.id === selectedBackend) ?? BACKEND_PRESETS[0];

  // Initialize JSON text from backend preset
  useEffect(() => {
    if (!jsonText && mode === "playground") {
      setJsonText(JSON.stringify(backend.payload, null, 2));
    }
  }, [selectedBackend, mode]);

  // Validate JSON
  const parsedJson = useMemo(() => {
    if (!jsonText.trim()) return null;
    try {
      const parsed = JSON.parse(jsonText);
      setJsonError(null);
      return parsed as Record<string, unknown>;
    } catch {
      setJsonError("Invalid JSON — fix syntax to continue");
      return null;
    }
  }, [jsonText]);

  // Extract available permissions from the JSON
  const availablePermissions = useMemo(() => {
    if (!parsedJson) return backend.permissions;
    return extractPermissions(parsedJson);
  }, [parsedJson, backend]);

  // Reset when backend changes
  const handleBackendChange = useCallback((id: BackendId) => {
    setSelectedBackend(id);
    const newBackend = BACKEND_PRESETS.find((b) => b.id === id);
    if (newBackend) {
      setJsonText(JSON.stringify(newBackend.payload, null, 2));
    }
    setPermissionQuery("");
    setHasRun(false);
    setPipelineActive(-1);
    setPipelineDone(false);
    setDecision(null);
    setJsonError(null);
    pipelineTimeoutRef.current.forEach(clearTimeout);
    pipelineTimeoutRef.current = [];
  }, []);

  // JSON editor handlers
  const handleJsonChange = useCallback((value: string) => {
    setJsonText(value);
    setHasRun(false);
    setPipelineActive(-1);
    setPipelineDone(false);
    setDecision(null);
  }, []);

  const handleLoadExample = useCallback(() => {
    setJsonText(JSON.stringify(backend.payload, null, 2));
    setJsonError(null);
    setHasRun(false);
    setPipelineActive(-1);
    setPipelineDone(false);
    setDecision(null);
  }, [backend]);

  const handleReset = useCallback(() => {
    setJsonText(JSON.stringify(backend.payload, null, 2));
    setPermissionQuery("");
    setJsonError(null);
    setHasRun(false);
    setPipelineActive(-1);
    setPipelineDone(false);
    setDecision(null);
  }, [backend]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch {
      // can't format invalid JSON
    }
  }, [jsonText]);

  // Run the permission check
  const handleRunCheck = useCallback(() => {
    if (!permissionQuery.trim()) return;
    if (jsonError) return;

    // Cancel any existing animation
    pipelineTimeoutRef.current.forEach(clearTimeout);
    pipelineTimeoutRef.current = [];

    setHasRun(true);
    setPipelineActive(0);
    setPipelineDone(false);
    setDecision(null);

    const stages = ["received", "adapter", "model", "check", "decision", "ui"];

    stages.forEach((stageId, index) => {
      const delay = 200 + index * 300;
      const timeout = setTimeout(() => {
        setPipelineActive(index);

        if (index === stages.length - 1) {
          // Compute the final decision
          const computed = computeDecision(
            permissionQuery,
            parsedJson ?? backend.payload,
            selectedBackend,
          );
          setDecision(computed);

          setTimeout(() => {
            setPipelineDone(true);
          }, 400);
        }
      }, delay);
      pipelineTimeoutRef.current.push(timeout);
    });
  }, [permissionQuery, jsonError, parsedJson, backend, selectedBackend]);

  // Keyboard shortcut: Enter to run
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleRunCheck();
      }
    },
    [handleRunCheck],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pipelineTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  // Can run?
  const canRun = permissionQuery.trim().length > 0 && !jsonError && !pipelineDone;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Accessly Lab
          </h1>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            v{typeof window !== "undefined" ? "0.1.0" : "0.1.0"}
          </span>
        </div>
        <p className="text-xs text-muted-dark/70 leading-relaxed max-w-xl">
          Paste a backend response, choose a permission, and watch Accessly
          explain exactly why it&apos;s allowed or denied.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="mb-6">
        <LabModeTabs active={mode} onChange={setMode} />
      </div>

      {/* ── PLAYGROUND MODE ── */}
      {mode === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column — Input */}
          <div className="lg:col-span-3 space-y-5">
            {/* Step 1: Backend */}
            <SectionCard step={1} title="Choose Backend" isActive>
              <BackendSelector
                selected={selectedBackend}
                onChange={handleBackendChange}
              />
            </SectionCard>

            {/* Step 2: JSON */}
            <SectionCard step={2} title="Paste Backend Response" isActive>
              <BackendJsonEditor
                value={jsonText}
                onChange={handleJsonChange}
                onLoadExample={handleLoadExample}
                onReset={handleReset}
                onFormat={handleFormat}
                error={jsonError}
              />

              {/* Detected permissions */}
              {parsedJson && !jsonError && (
                <div className="mt-3">
                  <div className="text-[10px] text-muted-dark/50 mb-1.5">
                    Detected permissions ({availablePermissions.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availablePermissions.slice(0, 8).map((perm) => (
                      <button
                        key={perm}
                        type="button"
                        onClick={() => setPermissionQuery(perm)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-primary/5 border border-primary/15 text-primary/70 hover:bg-primary/10 hover:text-primary transition-colors font-mono"
                      >
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Step 3: Permission */}
            <SectionCard step={3} title="Choose Permission" isActive>
              <PermissionCommand
                value={permissionQuery}
                onChange={setPermissionQuery}
                availablePermissions={availablePermissions}
                commonPermissions={COMMON_PERMS_DATA}
              />
            </SectionCard>

            {/* Step 4: Explain Decision button */}
            <div onKeyDown={handleKeyDown}>
              <button
                type="button"
                onClick={handleRunCheck}
                disabled={!canRun}
                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${
                    canRun
                      ? "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-surface-2/50 text-muted-dark/40 cursor-not-allowed"
                  }
                `}
              >
                <span>▶</span>
                <span>Explain Decision</span>
                {canRun && (
                  <span className="text-[9px] text-white/50 ml-auto">
                    ⏎ Enter
                  </span>
                )}
              </button>
            </div>

            {/* Copy actions */}
            {decision && pipelineDone && (
              <div className="flex items-center gap-2 flex-wrap">
                <CopyButton
                  label="Copy AccessModel"
                  value={JSON.stringify(
                    parsedJson ?? backend.payload,
                    null,
                    2,
                  )}
                />
                <CopyButton
                  label="Copy Adapter"
                  value={backend.adapterCode}
                />
                <CopyButton
                  label="Copy Decision"
                  value={JSON.stringify(decision, null, 2)}
                />
                <CopyButton
                  label="Copy React Code"
                  value={`import { Can } from "accessly";\n\n<Can permission="${decision.permission}">\n  <ProtectedComponent />\n</Can>`}
                />
              </div>
            )}

            {/* "What happened?" summary */}
            {decision && pipelineDone && (
              <div className="rounded-xl bg-surface/10 border border-border/10 px-4 py-3">
                <div className="text-[9px] text-muted-dark/40 uppercase tracking-wider mb-1.5">
                  What happened?
                </div>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Accessly {decision.granted ? "allowed" : "denied"} this
                  request because{" "}
                  <span className="text-foreground font-medium">
                    {decision.explanation.toLowerCase()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Right Column — Output */}
          <div className="lg:col-span-2 space-y-5">
            {/* Decision Replay */}
            <div className="sticky top-24">
              <SectionCard
                step={0}
                title="Pipeline"
                isActive={hasRun}
                hideNumber
              >
                <DecisionReplay
                  activeStep={pipelineActive}
                  isRunning={hasRun && !pipelineDone}
                  isDone={pipelineDone}
                  granted={decision?.granted ?? null}
                  backendId={selectedBackend}
                  permission={permissionQuery}
                />
              </SectionCard>

              {/* Result Summary */}
              {decision && pipelineDone && (
                <div className="mt-4">
                  <ResultSummary
                    decision={decision}
                    backendId={selectedBackend}
                    isVisible={true}
                  />
                </div>
              )}

              {/* UI Preview */}
              {decision && pipelineDone && (
                <div className="mt-4">
                  <ReactUiPreview
                    decision={decision}
                    isVisible={true}
                    backendId={selectedBackend}
                    permission={permissionQuery}
                  />
                </div>
              )}

              {/* Start over */}
              {pipelineDone && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 w-full text-[11px] py-2 rounded-lg border border-border/15 text-muted-dark hover:text-foreground hover:border-border/30 transition-colors"
                >
                  ← Start Over
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── INSPECTOR MODE ── */}
      {mode === "inspector" && (
        <div className="max-w-3xl">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground mb-1">
              Inspector
            </div>
            <p className="text-xs text-muted-dark/70 leading-relaxed">
              Advanced debug information for the last decision. Run a check in
              Playground first, then inspect the details here.
            </p>
          </div>

          {!hasRun || !decision ? (
            <div className="rounded-xl border border-border/10 bg-surface/10 px-6 py-8 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm text-muted-dark mb-1">
                No decision to inspect
              </div>
              <p className="text-xs text-muted-dark/60 max-w-sm mx-auto">
                Switch to Playground, paste a backend response, choose a
                permission, and click &ldquo;Explain Decision.&rdquo; Then come
                back here for the full debug view.
              </p>
            </div>
          ) : (
            <InspectorTabs
              decision={decision}
              backendId={selectedBackend}
              jsonText={jsonText}
              isVisible={true}
            />
          )}
        </div>
      )}

      {/* ── RECIPES MODE ── */}
      {mode === "recipes" && (
        <RecipeGallery
          isVisible={true}
          onSelectBackend={(id) => setSelectedBackend(id as BackendId)}
          onSelectPermission={setPermissionQuery}
          onSwitchMode={() => setMode("playground")}
        />
      )}
    </div>
  );
}

/* ── Section Card ── */

function SectionCard({
  step,
  title,
  children,
  isActive,
  hideNumber,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  hideNumber?: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl border transition-all duration-200
        ${isActive ? "border-border/20 bg-surface/10" : "border-border/5 bg-surface/5 opacity-50"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {!hideNumber && (
          <span
            className={`
              w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
              ${isActive ? "bg-primary text-white" : "bg-surface-2 text-muted-dark"}
            `}
          >
            {step}
          </span>
        )}
        <span className="text-[11px] font-semibold text-foreground">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

/* ── Copy Button ── */

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-surface/30 border border-border/15 text-muted-dark hover:text-foreground hover:border-border/30 transition-all"
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

/* ── Decision Engine ── */

function computeDecision(
  permission: string,
  payload: Record<string, unknown>,
  backendId: BackendId,
): LabDecision {
  const startTime = performance.now();

  // Extract permissions from the payload
  const allPerms = extractPermissions(payload);

  // Direct match
  const directMatch = allPerms.includes(permission);

  // Wildcard match (e.g., "repositories.*" matches "repositories.write")
  const wildcardMatches: string[] = [];
  const permParts = permission.split(".");
  for (const p of allPerms) {
    if (p.includes("*")) {
      const pattern = p.replace(/\./g, "\\.").replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(permission)) {
        wildcardMatches.push(p);
      }
    }
  }

  // Role expansion (e.g., "admin" role grants all permissions)
  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);
  const roles = extractRoles(payload, backend);
  const rolePermissions = expandRoles(roles);

  const roleMatch = rolePermissions.includes(permission);

  const granted = directMatch || wildcardMatches.length > 0 || roleMatch;

  const endTime = performance.now();
  const timing = Math.round((endTime - startTime) * 10) / 10;

  // Build plain English explanation
  let explanation = "";
  if (directMatch) {
    explanation = `Accessly allowed this request because the ${backend?.name ?? "Unknown"} adapter normalized the backend response into an AccessModel that contains "${permission}". The permission matched directly.`;
  } else if (wildcardMatches.length > 0) {
    explanation = `Accessly allowed this request because "${permission}" matched the wildcard pattern "${wildcardMatches[0]}" in the AccessModel.`;
  } else if (roleMatch) {
    explanation = `Accessly allowed this request because the user's role "${roles.join(", ")}" grants the "${permission}" permission through role expansion.`;
  } else {
    explanation = `Accessly denied this request because "${permission}" was not found in the normalized permissions and no wildcard or role expansion matched.`;
  }

  return {
    granted,
    permission,
    explanation,
    matched: directMatch
      ? permission
      : wildcardMatches.length > 0
        ? wildcardMatches[0]
        : roleMatch
          ? `role:${roles[0] ?? "unknown"}`
          : "N/A",
    source: directMatch
      ? "permissions"
      : wildcardMatches.length > 0
        ? "wildcard"
        : roleMatch
          ? "role_expansion"
          : "N/A",
    direct: directMatch,
    wildcardMatch: wildcardMatches.length > 0,
    wildcards: wildcardMatches,
    timing,
  };
}

/* ── Permission Extraction ── */

function extractPermissions(payload: Record<string, unknown>): string[] {
  // all_permissions (Laravel)
  if (Array.isArray(payload.all_permissions)) {
    return payload.all_permissions as string[];
  }
  // abilities (NestJS)
  if (Array.isArray(payload.abilities)) {
    return payload.abilities as string[];
  }
  // permissions (Custom, Supabase)
  if (Array.isArray(payload.permissions)) {
    return payload.permissions as string[];
  }
  // authorities (Spring Boot)
  if (Array.isArray(payload.authorities)) {
    return (payload.authorities as { authority?: string }[]).map(
      (a) => a.authority ?? "",
    ).filter(Boolean);
  }
  // claims (ASP.NET)
  if (Array.isArray(payload.claims)) {
    return (payload.claims as { type?: string; value?: string }[])
      .filter((c) => c.type === "permission")
      .map((c) => c.value ?? "")
      .filter(Boolean);
  }
  // scope (Express)
  if (
    payload.session &&
    typeof payload.session === "object" &&
    !Array.isArray(payload.session)
  ) {
    const session = payload.session as Record<string, unknown>;
    if (session.user && typeof session.user === "object") {
      const user = session.user as Record<string, unknown>;
      if (Array.isArray(user.scope)) {
        return user.scope as string[];
      }
    }
  }
  // user.abilities or user.permissions
  if (payload.user && typeof payload.user === "object" && !Array.isArray(payload.user)) {
    const u = payload.user as Record<string, unknown>;
    if (Array.isArray(u.abilities)) return u.abilities as string[];
    if (Array.isArray(u.permissions)) return u.permissions as string[];
  }
  // app_metadata.permissions (Supabase)
  if (payload.app_metadata && typeof payload.app_metadata === "object") {
    const meta = payload.app_metadata as Record<string, unknown>;
    if (Array.isArray(meta.permissions)) {
      return meta.permissions as string[];
    }
  }

  return [];
}

function extractRoles(
  payload: Record<string, unknown>,
  backend?: typeof BACKEND_PRESETS[number],
): string[] {
  // Direct roles array
  if (Array.isArray(payload.roles)) return payload.roles as string[];
  // role (string or array)
  if (Array.isArray(payload.role)) return payload.role as string[];
  if (typeof payload.role === "string") return [payload.role];
  // user.roles
  if (payload.user && typeof payload.user === "object") {
    const u = payload.user as Record<string, unknown>;
    if (Array.isArray(u.roles)) return u.roles as string[];
    if (typeof u.role === "string") return [u.role];
  }
  // session.roles
  if (payload.session && typeof payload.session === "object") {
    const s = payload.session as Record<string, unknown>;
    if (Array.isArray(s.roles)) return s.roles as string[];
  }
  // Spring Boot ROLE_ prefix
  if (Array.isArray(payload.roles)) {
    return (payload.roles as string[]).map((r) =>
      r.replace(/^ROLE_/, "").toLowerCase(),
    );
  }

  return backend?.roles ?? [];
}

function expandRoles(roles: string[]): string[] {
  const rolePermissions: string[] = [];

  for (const role of roles) {
    if (role === "admin" || role === "Administrator" || role === "administrator" || role === "owner") {
      rolePermissions.push(
        ...LOCAL_COMMON.slice(0, 10),
      );
    }
    if (role === "editor" || role === "developer" || role === "manager") {
      rolePermissions.push("repositories.read", "repositories.write", "posts.create", "posts.write", "users.view");
    }
    if (role === "viewer" || role === "member") {
      rolePermissions.push("repositories.read", "billing.view");
    }
  }

  return rolePermissions;
}

const LOCAL_COMMON = [
  "repositories.read",
  "repositories.write",
  "repositories.create",
  "repositories.delete",
  "repositories.admin",
  "posts.read",
  "posts.create",
  "posts.write",
  "posts.delete",
  "posts.publish",
];
