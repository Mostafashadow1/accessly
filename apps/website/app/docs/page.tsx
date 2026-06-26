"use client";

import { PermissionProvider, Can } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";

export default function DocsOverview() {
  const exampleAccess = {
    permissions: ["users.create", "users.delete", "pages.dashboard"],
  };

  return (
    <div>
      <div className="mb-10">
        <div className="section-label">Quick Start</div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          Getting Started
        </h1>
        <p className="section-body max-w-2xl">
          Install Accessly and add explainable permission checks to your React application in under one minute.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="step-badge flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">1</span>
          <h2 className="text-lg font-semibold text-foreground">
            Installation
          </h2>
        </div>
        <TerminalBlock commands={["pnpm add accessly"]} title="Install via pnpm" />
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="step-badge flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">2</span>
          <h2 className="text-lg font-semibold text-foreground">
            Quick Start
          </h2>
        </div>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Wrap your application in <code className="text-xs font-mono">PermissionProvider</code> and use the <code className="text-xs font-mono">&lt;Can&gt;</code> component to conditionally gate your UI.
        </p>

        {/* Shared container tying code block and sandbox together */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-surface">
            <CodeBlock
              title="App.tsx"
              code={`import { PermissionProvider, Can } from "accessly";

function App() {
  return (
    <PermissionProvider
      access={{
        permissions: ["users.create"]
      }}
    >
      <div className="actions">
        <Can permission="users.create">
          <CreateUserButton />
        </Can>
      </div>
    </PermissionProvider>
  );
}`}
            />
          </div>
          <div className="bg-surface">
            <PermissionProvider access={exampleAccess}>
              <PlaygroundPanel header="Live Sandbox Demo">
                <div className="mb-4 bg-surface-elevated/40 border border-border-light rounded-lg p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-dark mb-1">
                    Active Permissions
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs text-accent">
                    <span>users.create</span>
                    <span className="text-muted-dark">•</span>
                    <span>users.delete</span>
                    <span className="text-muted-dark">•</span>
                    <span>pages.dashboard</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <span className="block text-[10px] font-semibold text-muted mb-1.5">Gated with <code className="text-[10px]">users.create</code></span>
                    <Can permission="users.create">
                      <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-primary/10 border border-primary/20 text-primary transition-all hover:bg-primary/15 cursor-pointer">
                        Create User (Allowed)
                      </button>
                    </Can>
                  </div>

                  <div>
                    <span className="block text-[10px] font-semibold text-muted mb-1.5">Gated with <code className="text-[10px]">users.delete</code></span>
                    <Can permission="users.delete"
                      fallback={
                        <button disabled className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-hover/30 border border-border text-muted-dark cursor-not-allowed">
                          Delete User (Denied)
                        </button>
                      }>
                      <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-success/15 border border-success/30 text-success cursor-pointer">
                        Delete User (Allowed)
                      </button>
                    </Can>
                  </div>

                  <div>
                    <span className="block text-[10px] font-semibold text-muted mb-1.5">Gated with <code className="text-[10px]">pages.settings</code></span>
                    <Can permission="pages.settings"
                      fallback={
                        <button disabled className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-hover/30 border border-border text-muted-dark/40 cursor-not-allowed select-none">
                          Settings Panel (Denied — Hidden)
                        </button>
                      }>
                      <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white border-none cursor-pointer">Settings</button>
                    </Can>
                  </div>
                </div>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="step-badge flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">3</span>
          <h2 className="text-lg font-semibold text-foreground">
            Next Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/docs/core-concepts" className="card-base card-glow group block p-6 no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: "none" }}>
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-1.5">
              Core Concepts
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed m-0">
              Understand AccessModel shapes, dot-notation schemas, and evaluation details.
            </p>
          </a>
          <a href="/docs/backend-adapters" className="card-base card-glow group block p-6 no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: "none" }}>
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-1.5">
              Backend Adapters
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed m-0">
              Learn how to map responses from NestJS, Express, Rails, or Laravel automatically.
            </p>
          </a>
          <a href="/showcases" className="card-base card-glow group block p-6 no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: "none" }}>
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-1.5">
              Interactive Showcases
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed m-0">
              See list filtering, route guards, and live explanation output in action.
            </p>
          </a>
          <a href="/lab" className="card-base card-glow group block p-6 no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: "none" }}>
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-1.5">
              Accessly Lab Sandbox
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed m-0">
              Test customized permission rules with live backend JSON structures immediately.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}

