"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Scenario, PanelStatus, LogEntry } from "@/types/playground";
import { backends } from "@/data/backend-examples";
import { sidebarItems } from "@/data/navigation";
import { features } from "@/data/features";
import { getDecision } from "@/lib/playground";
import { PIPELINE_STEPS } from "./types";
import { PipelineArrow } from "./pipeline-arrow";
import { PipelinePanel } from "./pipeline-panel";
import { StepProgress } from "./step-progress";
import { LogsSection } from "./logs-section";
import { ScenarioToggle } from "./scenario-toggle";

export function Playground() {
  /* ── State ── */
  const [backendIdx, setBackendIdx] = useState(0);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("allowed");
  const [activeStep, setActiveStep] = useState(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const logCounter = useRef(0);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const backend = backends[backendIdx];
  const decision = getDecision(scenario, backend);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

  /* ── Helper: add a log entry ── */
  const addLog = useCallback((emoji: string, message: string) => {
    logCounter.current += 1;
    const id = logCounter.current;
    setLogs((prev) => [...prev, { id, message, emoji }]);
  }, []);

  /* ── Helper: clear all pending timeouts ── */
  const clearPendingTimeouts = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  }, []);

  /* ── Handle Send Request ── */
  const handleSend = useCallback(() => {
    /* Cancel any in-flight animation */
    clearPendingTimeouts();
    setSending(true);
    setActiveStep(-1);
    setHasRun(true);
    setLogs([]);
    logCounter.current = 0;

    const backendName = backend.label;

    /* Helper to schedule a step */
    const schedule = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timeoutIds.current.push(id);
    };

    /* Step 0 — request sent (immediate) */
    addLog("🚀", `Request sent to ${backendName} backend`);

    /* Step 1 — Backend Response (400ms) */
    schedule(400, () => {
      setActiveStep(0);
      addLog("📦", "Response received from API");
    });

    /* Step 2 — Adapter (800ms) */
    schedule(800, () => {
      setActiveStep(1);
      addLog("🔧", "Adapter normalized the response");
    });

    /* Step 3 — AccessModel (1200ms) */
    schedule(1200, () => {
      setActiveStep(2);
      addLog("📋", "AccessModel generated from adapter output");
    });

    /* Step 4 — Decision (1600ms) */
    schedule(1600, () => {
      setActiveStep(3);
      const checkedPermission = "posts.create";
      addLog("🔍", `Permission checked: ${checkedPermission}`);
      if (decision.allowed) {
        addLog("✅", "Decision: allowed");
      } else {
        addLog("❌", "Decision: denied (missing_permission)");
      }
    });

    /* Step 5 — UI Preview (2000ms) */
    schedule(2000, () => {
      setActiveStep(4);
      addLog("🎨", "UI updated based on decision");
    });

    /* Done (2400ms) */
    schedule(2400, () => {
      setActiveStep(-1);
      setSending(false);
      addLog("🏁", "Request lifecycle complete");
    });
  }, [backend.label, decision.allowed, addLog, clearPendingTimeouts]);

  /* ── Handle backend change ── */
  const handleBackendChange = useCallback(
    (idx: number) => {
      clearPendingTimeouts();
      setBackendIdx(idx);
      setSending(false);
      setActiveStep(-1);
      setHasRun(false);
      setLogs([]);
      logCounter.current = 0;
    },
    [clearPendingTimeouts],
  );

  /* ── Helper: get panel status ── */
  function getPanelStatus(stepIdx: number): PanelStatus {
    if (activeStep === -1) {
      return hasRun ? "settled" : "idle";
    }
    if (stepIdx === activeStep) return "loading";
    if (stepIdx < activeStep) return "settled";
    return "pending";
  }

  /* ── Determine if the arrow before this step should be highlighted ── */
  function isArrowHighlighted(stepIdx: number): boolean {
    if (activeStep === -1) return false;
    return stepIdx <= activeStep;
  }

  return (
    <div className="relative w-full">
      {/* Soft purple edge glow */}
      <div className="absolute -inset-x-8 -inset-y-6 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_60%)] pointer-events-none" />

      {/* ── App container ── */}
      <div className="relative rounded-2xl border border-border bg-surface/70 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* ─── Toolbar ─── */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border bg-[rgba(10,10,13,0.9)]">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Window dots (desktop) */}
            <div className="hidden sm:flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger/70" />
              <span className="w-3 h-3 rounded-full bg-warning/70" />
              <span className="w-3 h-3 rounded-full bg-success/70" />
            </div>
            {/* Title */}
            <span className="text-sm font-semibold text-foreground ml-0 sm:ml-1">
              Live Playground
            </span>
            {/* Live indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-success font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-[pulse-live_2s_ease-in-out_infinite]" />
              live
            </span>
          </div>

          {/* Right side toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Backend selector */}
            <div className="relative">
              <label htmlFor="backend-select" className="sr-only">
                Select backend
              </label>
              <select
                id="backend-select"
                value={backendIdx}
                onChange={(e) => handleBackendChange(Number(e.target.value))}
                disabled={sending}
                className="appearance-none bg-surface border border-border rounded-lg px-3 py-1.5 pr-7 text-[11px] font-mono font-medium text-foreground cursor-pointer outline-none focus:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {backends.map((b, i) => (
                  <option key={b.id} value={i}>
                    {b.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none text-[9px]">
                ▾
              </span>
            </div>

            {/* Scenario toggle */}
            <div className="hidden sm:block">
              <ScenarioToggle
                value={scenario}
                onChange={setScenario}
                disabled={sending}
              />
            </div>

            {/* Send Request button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-sm shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-primary/20"
              aria-busy={sending}
            >
              {sending ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 1L9 15l-3-7L1 7z" />
                  </svg>
                  <span>Send Request</span>
                </>
              )}
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Body: sidebar + content ─── */}
        <div className="flex">
          {/* ─── Sidebar ─── */}
          <aside
            className={`${
              sidebarOpen ? "block" : "hidden"
            } md:flex flex-col w-[190px] shrink-0 border-r border-border bg-[rgba(8,8,10,0.6)] p-3 gap-0.5`}
          >
            {/* Logo area */}
            <div className="flex items-center gap-2.5 px-2.5 py-3.5 mb-3 border-b border-border">
              <span className="w-5 h-5 rounded-[7px] bg-gradient-to-br from-primary to-violet flex items-center justify-center text-[9px] font-extrabold text-white shrink-0 shadow-sm shadow-primary/30">
                A
              </span>
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Accessly
              </span>
              <span className="ml-auto text-[9px] text-muted-dark font-mono">
                v0.1.0
              </span>
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-0.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-all duration-150 ${
                    item.active
                      ? "bg-primary/8 border border-primary/15 text-foreground font-semibold"
                      : "border border-transparent text-muted font-normal hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <span
                    className={`text-[10px] ${
                      item.active ? "text-accent" : "text-muted-dark"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Bottom status */}
            <div className="mt-auto pt-5 px-2.5">
              <div className="flex items-center gap-2 text-[10px] text-muted-dark font-mono border-t border-border pt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-success/60 animate-[pulse-live_2s_ease-in-out_infinite]" />
                connected
              </div>
            </div>
          </aside>

          {/* ─── Pipeline content ─── */}
          <div className="flex-1 p-4 md:p-5 lg:p-6 overflow-hidden">
            {/* Step progress bar */}
            <StepProgress steps={PIPELINE_STEPS} activeIdx={activeStep} />

            {/* Pipeline panels row */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
              {/* ── 1. Backend Response ── */}
              <PipelinePanel
                num="01"
                title="Backend Response"
                status={getPanelStatus(0)}
                accentIdle="bg-muted-dark"
                accentActive="bg-primary"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  Raw API output
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.response}
                </pre>
              </PipelinePanel>

              <PipelineArrow highlighted={isArrowHighlighted(0)} />

              {/* ── 2. Adapter ── */}
              <PipelinePanel
                num="02"
                title="Adapter"
                status={getPanelStatus(1)}
                accentIdle="bg-accent-foreground/50"
                accentActive="bg-accent-foreground"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  normalize
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.adapter}
                </pre>
              </PipelinePanel>

              <PipelineArrow highlighted={isArrowHighlighted(1)} />

              {/* ── 3. AccessModel ── */}
              <PipelinePanel
                num="03"
                title="AccessModel"
                status={getPanelStatus(2)}
                accentIdle="bg-success/50"
                accentActive="bg-success"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  unified schema
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.model}
                </pre>
              </PipelinePanel>

              <PipelineArrow highlighted={isArrowHighlighted(2)} />

              {/* ── 4. Decision ── */}
              <PipelinePanel
                num="04"
                title="Decision"
                status={getPanelStatus(3)}
                accentIdle={
                  decision.allowed ? "bg-success/50" : "bg-danger/50"
                }
                accentActive={decision.allowed ? "bg-success" : "bg-danger"}
              >
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${
                      decision.allowed
                        ? "text-success bg-success/6 border-success/15"
                        : "text-danger bg-danger/6 border-danger/15"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        decision.allowed ? "bg-success" : "bg-danger"
                      }`}
                    />
                    {decision.allowed ? "Allowed" : "Denied"}
                  </span>
                </div>

                {/* Permission */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-1">
                    Permission
                  </div>
                  <code className="block text-[11px] font-mono text-accent bg-primary/7 rounded-md px-2 py-1 border border-primary/15">
                    engine.check(&quot;{decision.permission}&quot;)
                  </code>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">reason</span>
                    <span
                      className={`font-mono font-medium ${
                        decision.allowed ? "text-success" : "text-danger"
                      }`}
                    >
                      {decision.reason}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">
                      matched by
                    </span>
                    <span
                      className={`font-mono ${
                        decision.allowed
                          ? "text-foreground"
                          : "text-muted-dark"
                      }`}
                    >
                      {decision.matchedBy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">source</span>
                    <span className="text-foreground/60 font-mono">
                      {decision.checkedFrom}
                    </span>
                  </div>
                </div>
              </PipelinePanel>

              <PipelineArrow highlighted={isArrowHighlighted(3)} />

              {/* ── 5. UI Preview ── */}
              <PipelinePanel
                num="05"
                title="UI Preview"
                status={getPanelStatus(4)}
                accentIdle="bg-primary/50"
                accentActive="bg-primary"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2.5">
                  rendered UI
                </div>

                <div className="flex-1 bg-black/30 rounded-xl border border-border-light p-3 flex flex-col gap-2.5">
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold border ${
                          decision.allowed
                            ? "bg-gradient-to-br from-primary/20 to-violet/20 text-accent border-primary/10"
                            : "bg-white/[0.03] text-muted-dark border-border"
                        }`}
                      >
                        +
                      </div>
                      <span
                        className={`text-[11px] font-semibold ${
                          decision.allowed
                            ? "text-foreground"
                            : "text-muted-dark"
                        }`}
                      >
                        Create Post
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md border ${
                        decision.allowed
                          ? "text-success bg-success/6 border-success/15"
                          : "text-danger bg-danger/6 border-danger/15"
                      }`}
                    >
                      {decision.allowed ? "enabled" : "denied"}
                    </span>
                  </div>

                  {/* Simulated form field */}
                  <div
                    className={`h-6 rounded-md border ${
                      decision.allowed
                        ? "bg-white/[0.04] border-border-light"
                        : "bg-white/[0.02] border-border/50"
                    }`}
                  />

                  {/* Action button */}
                  <button
                    disabled={!decision.allowed}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                      decision.allowed
                        ? "bg-gradient-to-r from-primary to-violet text-white shadow-sm shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-surface-2 text-muted-dark cursor-not-allowed border border-border"
                    }`}
                  >
                    {decision.allowed ? "Publish Post" : "Create Post"}
                  </button>

                  {/* Explanation */}
                  <p className="text-[9px] text-muted leading-relaxed">
                    {decision.allowed
                      ? "You have permission to create posts. The button is fully interactive."
                      : "Missing permission: posts.create. The action is unavailable."}
                  </p>
                </div>
              </PipelinePanel>
            </div>

            {/* Logs */}
            <LogsSection
              logs={logs}
              open={logsOpen}
              onToggle={() => setLogsOpen(!logsOpen)}
            />

            {/* Scenario toggle (mobile) */}
            <div className="sm:hidden mt-3 flex items-center justify-center">
              <ScenarioToggle
                value={scenario}
                onChange={setScenario}
                disabled={sending}
              />
            </div>

            {/* ─── Bottom feature strip ─── */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-border">
              {features.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium text-muted bg-surface border border-border hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.02] transition-all duration-200"
                >
                  <span className="text-[12px]">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
