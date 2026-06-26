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
      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
        Getting Started
      </h1>
      <p className="text-sm text-muted mb-8">
        Install Accessly and add explainable permission checks to your React app in under one minute.
      </p>

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Install</h2>
      <TerminalBlock commands={["pnpm add accessly"]} title="Install" />

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Quick Start</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CodeBlock
          title="Setup"
          code={`import { PermissionProvider, Can }
  from "accessly";

function App() {
  return (
    <PermissionProvider
      access={{
        permissions: [
          "users.create"
        ]
      }}
    >
      <Can permission="users.create">
        <CreateUserButton />
      </Can>
    </PermissionProvider>
  );
}`}
        />
        <PermissionProvider access={exampleAccess}>
          <PlaygroundPanel header="Live Example">
            <p className="text-sm text-muted mb-3">
              Permissions: users.create, users.delete, pages.dashboard
            </p>
            <div className="flex flex-col gap-2">
              <Can permission="users.create">
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-violet text-white border-none cursor-pointer">
                  Create User (allowed)
                </button>
              </Can>
              <Can permission="users.delete"
                fallback={
                  <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-surface text-muted-dark border border-border cursor-not-allowed">
                    Delete (denied)
                  </button>
                }>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-success text-white border-none cursor-pointer">
                  Delete User (allowed)
                </button>
              </Can>
              <Can permission="pages.settings"
                fallback={
                  <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-surface text-muted-dark border border-border cursor-not-allowed">
                    Settings (denied — hidden)
                  </button>
                }>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white border-none cursor-pointer">Settings</button>
              </Can>
            </div>
          </PlaygroundPanel>
        </PermissionProvider>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Next Steps</h2>
      <ul className="text-sm leading-relaxed text-muted space-y-2">
        <li><strong className="text-accent">Core Concepts</strong> — Understand AccessModel, permission names, and check types</li>
        <li><strong className="text-accent">Backend Adapters</strong> — Normalize any backend shape into AccessModel</li>
        <li><strong className="text-accent">Showcases</strong> — Interactive demos of every feature</li>
        <li><strong className="text-accent">Accessly Lab</strong> — Test Accessly with your own data, no install required</li>
      </ul>
    </div>
  );
}
