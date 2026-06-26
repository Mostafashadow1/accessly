"use client";

import { useState } from "react";
import { PermissionProvider, Can, useAccessDecision } from "accessly";
import type { AccessModel } from "accessly";
import { FeaturePill } from "@/components/ui/feature-pill";
import { JsonPanel } from "@/components/ui/json-panel";

// Predefined backend payloads
const presets = {
  developer: {
    user: {
      id: "usr_laravel_dev",
      roles: ["developer", "member"],
      plan: "pro"
    },
    permissions: {
      repositories: ["read", "write", "admin"],
      billing: ["view"],
      settings: []
    },
    features: {
      beta_deployments: true,
      enterprise_sso: false
    }
  },
  member: {
    user: {
      id: "usr_nest_member",
      roles: ["member"],
      plan: "free"
    },
    permissions: {
      repositories: ["read"],
      billing: [],
      settings: []
    },
    features: {
      beta_deployments: false,
      enterprise_sso: false
    }
  },
  billingAdmin: {
    user: {
      id: "usr_asp_billing",
      roles: ["billing_manager"],
      plan: "enterprise"
    },
    permissions: {
      repositories: [],
      billing: ["view", "edit"],
      settings: ["manage"]
    },
    features: {
      beta_deployments: true,
      enterprise_sso: true
    }
  }
};

type PresetKey = keyof typeof presets;

export function LabContent() {
  const [activePreset, setActivePreset] = useState<PresetKey>("developer");
  const [jsonText, setJsonText] = useState(JSON.stringify(presets.developer, null, 2));
  const [permissionQuery, setPermissionQuery] = useState("repositories.write");
  const [isFlagCheck, setIsFlagCheck] = useState(false);

  // Load preset helper
  const handlePresetSelect = (presetKey: PresetKey) => {
    setActivePreset(presetKey);
    setJsonText(JSON.stringify(presets[presetKey], null, 2));
  };

  // Parse check
  let parsedJson: typeof presets.developer | null = null;
  let parseError: string | null = null;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch (err: unknown) {
    if (err instanceof Error) {
      parseError = err.message;
    } else {
      parseError = "Invalid JSON syntax";
    }
  }

  // Normalize backend payload to standard AccessModel
  const computedModel = (() => {
    if (!parsedJson) return { permissions: [], flags: [] } as AccessModel;

    const permissionsList: string[] = [];
    if (parsedJson.permissions && typeof parsedJson.permissions === "object") {
      Object.entries(parsedJson.permissions).forEach(([resource, actions]) => {
        if (Array.isArray(actions)) {
          actions.forEach((action) => {
            permissionsList.push(`${resource}.${action}`);
          });
        }
      });
    }

    const flagsList: string[] = [];
    if (parsedJson.features && typeof parsedJson.features === "object") {
      Object.entries(parsedJson.features).forEach(([flagName, enabled]) => {
        if (enabled === true) {
          flagsList.push(`features.${flagName}`);
        }
      });
    }

    return {
      user: parsedJson.user || {},
      permissions: permissionsList,
      flags: flagsList,
    } as AccessModel;
  })();

  const jsonValidity = parseError ? "invalid" : "valid";

  return (
    <div className="min-h-screen">
      {/* Top Header - Hero Section */}
      <div className="relative border-b border-border overflow-hidden">
        {/* Radial glow */}
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />
        {/* Dot grid */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "24px 24px", maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 85%)" }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-20 pb-16">
          <FeaturePill label="Interactive Playground" />
          <h1
            className="font-bold -tracking-[0.035em] text-foreground mt-5 mb-4"
            style={{ fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 1.05 }}
          >
            Accessly Lab
          </h1>
          <p className="text-[16px] md:text-[17px] text-muted leading-relaxed max-w-[480px] mx-auto text-balance">
            Test custom permission mappers, configure roles, and simulate frontend
            conditional gating in real-time before installing.
          </p>

          {/* Preset selectors */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="text-[11px] font-bold text-muted self-center mr-2 uppercase tracking-[0.1em]">Presets:</span>
            {(Object.keys(presets) as PresetKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 cursor-pointer ${
                  activePreset === key
                    ? "bg-gradient-to-r from-primary to-violet text-white border-transparent shadow-md shadow-primary/25"
                    : "bg-surface text-muted border-border hover:text-foreground hover:border-white/20"
                }`}
              >
                {key === "developer" && "Laravel Developer"}
                {key === "member" && "NestJS Member"}
                {key === "billingAdmin" && "ASP.NET Billing Manager"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Backend Payload and Output Model */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* JSON Input Editor - Primary Panel */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-surface/50 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Raw Backend Payload
                </span>
                {jsonValidity === "valid" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono text-success bg-success-bg border border-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-[glowPulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] inline-block" />
                    Valid JSON
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono text-danger bg-danger-bg border border-danger/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
                    Invalid JSON
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted font-mono">Editable</span>
            </div>
            <div className="p-5">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={11}
                className="w-full bg-[#060608] border border-border-light rounded-lg p-3 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 resize-y"
                placeholder="Paste backend JSON response..."
              />
              {parseError && (
                <div className="mt-2 text-xs text-danger font-mono bg-danger-bg/50 border border-danger/10 p-2.5 rounded">
                  {parseError}
                </div>
              )}
            </div>
          </div>

          {/* Normalizer output preview - Secondary Panel */}
          <div className="rounded-xl border border-border-light bg-surface-2 overflow-hidden">
            <div className="px-5 py-3 border-b border-border-light">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Normalized AccessModel (Result)
              </span>
            </div>
            <div className="p-5">
              <JsonPanel data={computedModel} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Checker Console and Live UI Mockup */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Permission Provider Wrapper */}
          <PermissionProvider access={computedModel}>
            {/* Live Testing Console - Accent Panel */}
            <div className="rounded-xl border border-primary/20 bg-surface overflow-hidden shadow-[inset_0_0_0_1px_rgba(99,102,241,0.05)]">
              <div className="px-5 py-3 border-b border-border">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Permission Tester Console
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={permissionQuery}
                      onChange={(e) => setPermissionQuery(e.target.value)}
                      className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary/50"
                      placeholder="Enter permission (e.g. repositories.write)..."
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 bg-surface border border-border rounded-lg self-stretch">
                    <input
                      type="checkbox"
                      id="flagCheck"
                      checked={isFlagCheck}
                      onChange={(e) => setIsFlagCheck(e.target.checked)}
                      className="w-3.5 h-3.5 accent-primary cursor-pointer"
                    />
                    <label htmlFor="flagCheck" className="text-xs font-medium text-muted cursor-pointer select-none">
                      Feature Flag
                    </label>
                  </div>
                </div>

                {/* Display Decision Details */}
                <ConsoleResult query={permissionQuery} isFlag={isFlagCheck} />
              </div>
            </div>

            {/* Live UI Mock Preview */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              {/* Divider separator before this section */}
              <div className="h-px bg-border" />

              <div className="px-5 py-3 border-b border-border">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Live UI Preview
                </span>
              </div>

              {/* Feature Flag Banner Gating */}
              <Can permission={{ flag: "features.beta_deployments" }}>
                <div className="bg-primary-glow border-b border-primary/20 px-4 py-2 text-center text-xs font-medium text-accent">
                  🚀 Deployments Beta Feature is Active in your Workspace!
                </div>
              </Can>

              <div className="flex min-h-[220px]">
                {/* Visual sidebar */}
                <div className="w-40 border-r border-border-light bg-[#08080a] p-3 flex flex-col gap-1 shrink-0">
                  <span className="block text-[8px] font-bold text-muted-dark uppercase tracking-widest mb-3 px-2">
                    WORKSPACE NAV
                  </span>
                  <div className="px-2 py-1.5 rounded text-xs font-medium text-foreground bg-surface-hover">
                    Dashboard
                  </div>

                  {/* Sidebar item gated with repositories.read */}
                  <Can
                    permission="repositories.read"
                    fallback={
                      <div className="px-2 py-1.5 rounded text-xs font-medium text-muted-dark flex items-center justify-between group cursor-not-allowed">
                        <span>Repositories</span>
                        <span className="text-[9px] px-1 bg-surface border border-border-light rounded">Locked</span>
                      </div>
                    }
                  >
                    <div className="px-2 py-1.5 rounded text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover flex items-center justify-between cursor-pointer">
                      <span>Repositories</span>
                    </div>
                  </Can>

                  {/* Sidebar item gated with billing.view (completely hidden if denied) */}
                  <Can permission="billing.view">
                    <div className="px-2 py-1.5 rounded text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover cursor-pointer">
                      Billing Panel
                    </div>
                  </Can>

                  <Can permission="settings.manage">
                    <div className="px-2 py-1.5 rounded text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover cursor-pointer">
                      Settings
                    </div>
                  </Can>
                </div>

                {/* Simulated Content Area */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">Active Repository</h4>
                      <Can permission={{ flag: "features.enterprise_sso" }}
                        fallback={<span className="text-[9px] text-muted border border-border px-1.5 py-0.5 rounded">Standard Account</span>}>
                        <span className="text-[9px] text-primary border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Enterprise SSO</span>
                      </Can>
                    </div>
                    <p className="text-xs text-muted mb-4 leading-relaxed">
                      This simulated interface reacts instantly as you alter the JSON payload or active preset parameters on the left.
                    </p>
                  </div>

                  {/* Action row gated with repositories.write & repositories.admin */}
                  <div className="flex gap-2">
                    <Can
                      permission="repositories.write"
                      fallback={
                        <button disabled className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-border text-muted-dark cursor-not-allowed">
                          Create Repo (Locked)
                        </button>
                      }
                    >
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:scale-[1.01] transition-transform cursor-pointer border-none">
                        Create Repository
                      </button>
                    </Can>

                    <Can
                      permission="repositories.admin"
                      fallback={
                        <button disabled className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-border text-muted-dark/50 cursor-not-allowed">
                          Delete (Restricted)
                        </button>
                      }
                    >
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-danger/10 border border-danger/20 text-danger hover:bg-danger/15 cursor-pointer">
                        Delete
                      </button>
                    </Can>
                  </div>
                </div>
              </div>
            </div>
          </PermissionProvider>
        </div>
      </div>
    </div>
    </div>
  );
}

// Inner helper component to consume PermissionProvider context dynamically
function ConsoleResult({ query, isFlag }: { query: string; isFlag: boolean }) {
  const checkArg = isFlag ? { flag: query } : query;
  const decision = useAccessDecision(checkArg);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted">Evaluation Result:</span>
        {decision.allowed ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono text-success bg-success-bg border border-success/20">Access Granted</span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono text-danger bg-danger-bg border border-danger/20">Access Denied</span>
        )}
      </div>

      <div className="mt-1">
        <span className="block text-[9px] font-bold text-muted-dark uppercase tracking-wider mb-1.5">
          Resolved Decision Object (JSON)
        </span>
        <JsonPanel data={decision} />
      </div>
    </div>
  );
}
