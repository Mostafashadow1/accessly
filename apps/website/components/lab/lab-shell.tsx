"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { LabMode, BackendId, LabDecision } from "@/types/lab";
import { BACKEND_PRESETS, COMMON_PERMISSIONS as COMMON_PERMS_DATA } from "@/data/lab-examples";
import {
  computeLabDecision,
  extractPermissions,
  getEffectivePermissions,
} from "@/lib/lab-decision";
import { LabModeTabs } from "./lab-mode-tabs";
import { BackendSelector } from "./backend-selector";
import { BackendJsonEditor } from "./backend-json-editor";
import { PermissionCommand } from "./permission-command";
import { DecisionReplay } from "./decision-replay";
import { ResultSummary } from "./result-summary";
import { ReactUiPreview } from "./react-ui-preview";
import { InspectorTabs } from "./inspector-tabs";

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
  const pipelineTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const backend = BACKEND_PRESETS.find((b) => b.id === selectedBackend) ?? BACKEND_PRESETS[0];

  // Initialize JSON text from backend preset
  useEffect(() => {
    if (!jsonText && mode === "playground") {
      setJsonText(JSON.stringify(backend.payload, null, 2));
    }
  }, [selectedBackend, mode]);

  // Validate JSON
  const jsonValidation = useMemo(() => {
    if (!jsonText.trim()) return { data: null, error: null };
    try {
      const parsed = JSON.parse(jsonText);
      return { data: parsed as Record<string, unknown>, error: null };
    } catch {
      return { data: null, error: "Invalid JSON - fix syntax to continue" };
    }
  }, [jsonText]);
  const parsedJson = jsonValidation.data;
  const jsonError = jsonValidation.error;

  // Extract available permissions from the JSON
  const availablePermissions = useMemo(() => {
    if (jsonError) return [];
    if (!parsedJson) return backend.permissions;
    return extractPermissions(parsedJson);
  }, [jsonError, parsedJson, backend]);

  const effectivePermissions = useMemo(() => {
    if (jsonError) {
      return { raw: [], roleExpanded: [], final: [], flags: [], roles: [] };
    }
    return getEffectivePermissions(parsedJson ?? backend.payload, selectedBackend);
  }, [jsonError, parsedJson, backend, selectedBackend]);

  const decision = useMemo<LabDecision | null>(() => {
    if (!hasRun || !pipelineDone || !permissionQuery.trim() || jsonError) return null;
    return computeLabDecision(
      permissionQuery,
      parsedJson ?? backend.payload,
      selectedBackend,
    );
  }, [hasRun, pipelineDone, permissionQuery, jsonError, parsedJson, backend, selectedBackend]);

  // Reset when backend changes
  const handleBackendChange = useCallback((id: BackendId) => {
    setSelectedBackend(id);
    const newBackend = BACKEND_PRESETS.find((b) => b.id === id);
    if (newBackend) {
      setJsonText(JSON.stringify(newBackend.payload, null, 2));
    }
    setPipelineActive(hasRun ? 5 : -1);
    setPipelineDone(hasRun && Boolean(permissionQuery.trim()));
    pipelineTimeoutRef.current.forEach(clearTimeout);
    pipelineTimeoutRef.current = [];
  }, [hasRun, permissionQuery]);

  // JSON editor handlers
  const handleJsonChange = useCallback((value: string) => {
    setJsonText(value);
    if (!hasRun) {
      setPipelineActive(-1);
      setPipelineDone(false);
    }
  }, [hasRun]);

  const handleLoadExample = useCallback(() => {
    setJsonText(JSON.stringify(backend.payload, null, 2));
    if (!hasRun) {
      setPipelineActive(-1);
      setPipelineDone(false);
    }
  }, [backend, hasRun]);

  const handleReset = useCallback(() => {
    setJsonText(JSON.stringify(backend.payload, null, 2));
    setPermissionQuery("");
    setHasRun(false);
    setPipelineActive(-1);
    setPipelineDone(false);
  }, [backend]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
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

    const stages = ["received", "adapter", "model", "check", "decision", "ui"];

    stages.forEach((stageId, index) => {
      const delay = 200 + index * 300;
      const timeout = setTimeout(() => {
        setPipelineActive(index);

        if (index === stages.length - 1) {
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
  const isRunning = hasRun && !pipelineDone;
  const canRun = permissionQuery.trim().length > 0 && !jsonError && !isRunning;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            Developer tool
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Accessly Lab
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Paste a backend response, choose a permission, and replay the
            decision path from payload to UI result.
          </p>
        </div>
        <div className="w-full md:w-[360px]">
          <LabModeTabs active={mode} onChange={setMode} />
        </div>
      </div>

      {/* ── PLAYGROUND MODE ── */}
      {mode === "playground" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
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
                effectivePermissions={effectivePermissions}
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
                  isRunning={isRunning}
                  isDone={pipelineDone}
                  granted={decision?.granted ?? null}
                  backendId={selectedBackend}
                  permission={permissionQuery}
                  decisionLabel={
                    pipelineDone
                      ? decision?.pipelineLabel
                      : hasRun
                        ? "Decision pending: loading"
                        : undefined
                  }
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

              {pipelineDone && !jsonError && (
                <div className="mt-4">
                  <EffectivePermissionsPanel
                    raw={effectivePermissions.raw}
                    roleExpanded={effectivePermissions.roleExpanded}
                    final={effectivePermissions.final}
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
        <div className="max-w-4xl">
          <div className="mb-5">
            <div className="text-base font-semibold text-foreground mb-1">
              Inspector
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Inspect the last decision result, normalized AccessModel, trace,
              and logs.
            </p>
          </div>

          {!hasRun || !decision ? (
            <div className="rounded-2xl border border-border bg-surface/45 px-6 py-10 text-center">
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
        rounded-2xl border transition-all duration-200
        ${isActive ? "border-border bg-surface/45" : "border-border/40 bg-surface/20 opacity-70"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
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
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">{children}</div>
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
      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-surface/50 border border-border text-muted hover:text-foreground hover:border-border-hover transition-all"
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

function EffectivePermissionsPanel({
  raw,
  roleExpanded,
  final,
}: {
  raw: string[];
  roleExpanded: LabDecision["effectivePermissions"]["roleExpanded"];
  final: string[];
}) {
  return (
    <section
      aria-label="Effective permissions"
      className="rounded-xl border border-border/15 bg-surface/20 p-4"
    >
      <div className="mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Effective Permissions
        </h2>
        <p className="mt-1 text-[11px] leading-5 text-muted-dark">
          Raw backend permissions plus role expansion become the final set used
          for checks.
        </p>
      </div>
      <div className="space-y-3">
        <PermissionGroup title="Raw backend permissions" items={raw} empty="No raw backend permissions" />
        <PermissionGroup
          title="Role-expanded permissions"
          items={roleExpanded.map((item) => `${item.role} -> ${item.permission}`)}
          empty="No role-expanded permissions"
        />
        <PermissionGroup title="Final effective permissions" items={final} empty="No effective permissions" />
      </div>
    </section>
  );
}

function PermissionGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-dark/70">
        {title}
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <code
              key={item}
              className="rounded-md border border-border/15 bg-surface/35 px-1.5 py-0.5 text-[10px] text-foreground"
            >
              {item}
            </code>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border/20 px-2 py-1.5 text-[11px] text-muted-dark/70">
          {empty}
        </div>
      )}
    </div>
  );
}
