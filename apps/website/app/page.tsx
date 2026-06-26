"use client";

import { PermissionProvider, Can } from "accessly";
import { SectionHeader } from "@/components/ui/section-header";
import { CodeBlock } from "@/components/ui/code-block";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { JsonPanel } from "@/components/ui/json-panel";
import { PlaygroundPanel } from "@/components/ui/playground-panel";
import { Card, CardGrid } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeaturePill } from "@/components/ui/feature-pill";
import Link from "next/link";

export default function HomePage() {
  const exampleAccess = {
    permissions: ["users.create", "users.delete", "pages.dashboard"],
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="section">
        <div className="section-container">
          <div className="flex flex-col items-center text-center mx-auto mb-xl" style={{maxWidth: "48rem"}}>
            <FeaturePill label="v0.1.0 · Open Source · MIT" />
            <h1 className="text-4xl font-bold leading-tight mt-lg mb-md" style={{fontSize: "clamp(2rem, 5vw, 2.75rem)"}}>
              Permission checks that
              <br />
              <span className="text-accent">explain themselves</span>
            </h1>
            <p className="text-md leading-relaxed mx-auto text-secondary" style={{maxWidth: "36rem", fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)"}}>
              Every other library returns <code className="text-accent inline-code">true</code> or <code className="text-denied inline-code">false</code>.
              <br />
              Accessly returns <em>why</em> — with matched rules, missing permissions,
              and the exact source of the decision.
            </p>
            <div className="flex items-center gap-sm mt-xl">
              <Link href="/lab">
                <Button variant="primary" size="lg">
                  Try Accessly Lab
                  <span aria-hidden="true" className="text-lg">→</span>
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="lg">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero comparison playground */}
          <PermissionProvider access={exampleAccess}>
            <div className="grid-2 mt-xl">
              <PlaygroundPanel header="Accessly returns">
                <JsonPanel
                  data={{
                    allowed: true,
                    reason: "allowed",
                    requested: ["users.create"],
                    matched: ["users.create"],
                    missing: undefined,
                    checkedFrom: "direct",
                  }}
                />
              </PlaygroundPanel>
              <PlaygroundPanel header="Other libraries return">
                <div className="flex items-center justify-center bg-code border-code text-code-boolean font-bold font-mono" style={{borderRadius: "var(--radius-lg)", minHeight: "180px", fontSize: "1.75rem"}}>
                  true
                </div>
              </PlaygroundPanel>
            </div>
          </PermissionProvider>
        </div>
      </section>

      {/* ── Quick Install ──────────────────────────── */}
      <section className="section-sm bg-raised border-t-surface border-b-surface">
        <div className="section-container">
          <div className="mx-auto" style={{maxWidth: "28rem"}}>
            <TerminalBlock commands={["pnpm add accessly"]} title="Install" />
          </div>
        </div>
      </section>

      {/* ── Quick Start ────────────────────────────── */}
      <section className="section">
        <div className="section-container">
          <SectionHeader
            title="One provider. Any component."
            description="Wrap your app once, gate anything anywhere."
          />
          <div className="grid-2">
            <CodeBlock
              title="Setup"
              code={`import { PermissionProvider } from "accessly";
import { createAdapter } from "accessly";

const adapter = createAdapter((src) => ({
  permissions: src.permissions,
  user: src.user,
}));

function App() {
  return (
    <PermissionProvider
      source={response}
      adapter={adapter}
    >
      <Dashboard />
    </PermissionProvider>
  );
}`}
            />
            <div>
              <PermissionProvider access={exampleAccess}>
                <PlaygroundPanel header="Live: Component Guard">
                  <div className="flex flex-col gap-sm">
                    <p className="text-base m-0 text-secondary">
                      Current permissions: users.create, users.delete, pages.dashboard
                    </p>
                    <Can permission="users.create">
                      <span className="inline-flex items-center gap-xs px-4 py-2 bg-allowed text-allowed font-medium" style={{borderRadius: "var(--radius-lg)", fontSize: "var(--font-size-md)"}}>
                        ✅  Create User — allowed
                      </span>
                    </Can>
                    <Can permission="pages.dashboard">
                      <span className="inline-flex items-center gap-xs px-4 py-2 bg-allowed text-allowed font-medium" style={{borderRadius: "var(--radius-lg)", fontSize: "var(--font-size-md)"}}>
                        ✅  Dashboard — allowed
                      </span>
                    </Can>
                    <Can
                      permission="pages.settings"
                      fallback={
                        <span className="inline-flex items-center gap-xs px-4 py-2 bg-denied text-denied font-medium" style={{borderRadius: "var(--radius-lg)", fontSize: "var(--font-size-md)"}}>
                          🚫  Settings — denied (hidden)
                        </span>
                      }
                    >
                      <span>Settings</span>
                    </Can>
                  </div>
                </PlaygroundPanel>
              </PermissionProvider>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────── */}
      <section className="section bg-raised border-t-surface">
        <div className="section-container">
          <SectionHeader
            title="Everything you need for production access control"
            align="center"
          />
          <CardGrid cols={3}>
            <Card header="🔍  Explain Engine">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Every permission check returns a full decision object. See exactly why access was granted or denied — <code className="text-code-key inline-code">matched</code>, <code className="text-code-key inline-code">missing</code>, <code className="text-code-key inline-code">checkedFrom</code>, and <code className="text-code-key inline-code">reason</code>.
              </p>
            </Card>
            <Card header="🔌  Backend Adapters">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Laravel, NestJS, Express, Django — any backend shape normalizes into one <code className="text-code-key inline-code">AccessModel</code>. Five built-in adapters plus a custom adapter factory.
              </p>
            </Card>
            <Card header="🧩  Component + Hook + Route">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Use <code className="text-code-key inline-code">{`<Can>`}</code>, <code className="text-code-key inline-code">usePermission()</code>, or <code className="text-code-key inline-code">{`<ProtectedRoute>`}</code> — same engine, same decision object, any pattern.
              </p>
            </Card>
            <Card header="🛡️  RBAC + Role Expansion">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Define role-to-permission maps. Role-based permissions auto-expand and are tracked with <code className="text-code-key inline-code">checkedFrom: &quot;role&quot;</code>.
              </p>
            </Card>
            <Card header="🚩  Feature Flags">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Built-in flag support. Check permissions against flags with the same API — <code className="text-code-key inline-code">{`<Can permission={{ flag: "features.beta" }}>`}</code>.
              </p>
            </Card>
            <Card header="🌀  Navigation Filtering">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Filter sidebar navigation items automatically based on permissions. Nested items, recursive filtering, zero boilerplate.
              </p>
            </Card>
            <Card header="🐞  Debug Tools">
              <p className="text-base leading-relaxed m-0 text-secondary">
                <code className="text-code-key inline-code">formatDecision()</code> and <code className="text-code-key inline-code">inspectAccess()</code> output formatted, human-readable permission diagnostics for your console.
              </p>
            </Card>
            <Card header="⚡  TypeScript First">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Full type definitions exported. Every API surface is typed. Autocomplete works out of the box.
              </p>
            </Card>
            <Card header="🌲  Tree Shakeable">
              <p className="text-base leading-relaxed m-0 text-secondary">
                Import only what you use. ~5kB gzip. ESM + CJS. Zero external dependencies.
              </p>
            </Card>
          </CardGrid>
        </div>
      </section>

      {/* ── Adapter preview ────────────────────────── */}
      <section className="section">
        <div className="section-container">
          <SectionHeader
            title="Your backend, any shape"
            description="Every backend returns permissions differently. Accessly normalizes them all into one model."
          />
          <CardGrid cols={2}>
            <PlaygroundPanel header="Five built-in adapters">
              <div className="flex flex-col gap-sm">
                <CodeBlock
                  title="directPermissionsAdapter"
                  language="ts"
                  code={`directPermissionsAdapter({
  permissions: ["pages.dashboard"],
  roles: ["admin"],
  flags: ["beta"],
})`}
                />
                <CodeBlock
                  title="createActionsAdapter"
                  language="ts"
                  code={`createActionsAdapter({
  users: ["create", "delete"],
  reports: ["view"],
})
// → ["users.create", "users.delete", "reports.view"]`}
                />
                <CodeBlock
                  title="nestedModulesAdapter"
                  language="ts"
                  code={`nestedModulesAdapter({
  users: { create: true, delete: false },
})
// → ["users.create"]`}
                />
              </div>
            </PlaygroundPanel>
            <PlaygroundPanel header="Or write your own">
              <CodeBlock
                title="createAdapter"
                language="ts"
                code={`import { createAdapter } from "accessly";

const adapter = createAdapter(
  (apiResponse) => ({
    user: {
      id: apiResponse.userId,
      roles: [apiResponse.role],
    },
    permissions: apiResponse.actions
      .map(a => PERMISSION_MAP[a])
      .filter(Boolean),
  })
);

// Then:
<PermissionProvider
  source={response}
  adapter={adapter}
>
  <App />
</PermissionProvider>`}
              />
            </PlaygroundPanel>
          </CardGrid>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="section text-center bg-raised border-t-surface">
        <div className="section-container">
          <h2 className="section-header-title mb-md text-center">
            See it work with your data
          </h2>
          <p className="text-secondary mb-lg mx-auto text-md" style={{maxWidth: "28rem"}}>
            Pick your backend, paste your JSON, watch permissions resolve in real time.
            No install required.
          </p>
          <div className="flex items-center justify-center gap-sm">
            <Link href="/lab">
              <Button variant="primary" size="lg">
                Open Accessly Lab
                <span aria-hidden="true" className="text-lg">→</span>
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="secondary" size="lg">
                Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
