"use client";

import { PermissionProvider, Can } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";

export default function CoreConcepts() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-[11px] font-semibold tracking-[0.06em] uppercase mb-4">
          Core Concepts
        </span>
        <h1 className="text-3xl md:text-[40px] font-bold -tracking-[0.03em] text-foreground mb-3">
          Core Concepts
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-2xl">
          Understand the internal normalized shape used by Accessly to resolve all permission rules and checks.
        </p>
      </div>

      {/* Section 1: AccessModel */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
            1
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
            AccessModel
          </h2>
        </div>
        <p className="text-[14px] text-muted leading-relaxed mb-5">
          All user permissions, metadata roles, feature flags, and custom navigation matrices are aggregated into a single unified TypeScript structure.
        </p>
        <CodeBlock
          title="AccessModel Type Definition"
          code={`type AccessModel = {
  user?: {
    id?: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
  };
  permissions?: string[];
  flags?: string[];
  navigation?: NavigationItem[];
  isLoading?: boolean;
};`}
        />
      </section>

      {/* Section 2: Permission Namespaces */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
            2
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
            Permission Namespaces
          </h2>
        </div>
        <p className="text-[14px] text-muted leading-relaxed mb-5">
          Accessly structures permissions as hierarchical string tokens. You can group these by pages, features, attributes, or actions using dot-notation.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-2 border-b border-border">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Type</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Standard Pattern Example</th>
              </tr>
            </thead>
            <tbody>
              {([
                ["Page / Route level", "pages.dashboard"],
                ["Action / Resource level", "users.create"],
                ["Granular Field level", "users.salary.view"],
                ["Feature Flag level", "features.new-dashboard"],
              ] as const).map(([type, example]) => (
                <tr key={type} className="hover:bg-primary/5 transition-colors">
                  <td className="px-5 py-3.5 border-b border-border/50 text-foreground font-medium">{type}</td>
                  <td className="px-5 py-3.5 border-b border-border/50">
                    <code className="text-accent text-xs font-mono">{example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Feature Flags */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
            3
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
            Feature Flags Checks
          </h2>
        </div>
        <p className="text-[14px] text-muted leading-relaxed mb-5">
          Flags represent binary features (A/B testing, rollout levels, settings). Query flags directly with the{" "}
          <code className="text-xs font-mono text-accent">flag</code> wrapper syntax.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CodeBlock
            title="Feature Flag Gate"
            code={`<PermissionProvider
  access={{
    permissions: [],
    flags: ["features.beta"]
  }}
>
  <Can permission={{ flag: "features.beta" }}>
    <BetaFeature />
  </Can>
</PermissionProvider>`}
          />
          <PermissionProvider access={{ permissions: [], flags: ["features.beta"] }}>
            <PlaygroundPanel header="Live Sandbox">
              <div className="flex flex-col items-center justify-center p-8 bg-surface-hover/20 border border-border-subtle rounded-lg">
                <Can permission={{ flag: "features.beta" }}>
                  <div className="flex items-center gap-2 text-success font-medium text-sm">
                    <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                    <span>✓ Beta Feature is Enabled &amp; Active</span>
                  </div>
                </Can>
              </div>
            </PlaygroundPanel>
          </PermissionProvider>
        </div>
      </section>

      {/* Section 4: Logical Checks */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
            4
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
            Logical Checks (any / all)
          </h2>
        </div>
        <p className="text-[14px] text-muted leading-relaxed mb-5">
          Combine permission names using logical operators to grant access only if a user has at least one matching token (
          <code className="text-xs font-mono text-accent">any</code>) or all required tokens (
          <code className="text-xs font-mono text-accent">all</code>).
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CodeBlock
            title="Logical Operators"
            code={`// At least one permission matches:
<Can permission={{
  any: ["users.create", "users.delete"]
}}>
  <ActionPanel />
</Can>

// All permissions are required:
<Can permission={{
  all: ["users.create", "users.delete"]
}}>
  <AdminPanel />
</Can>`}
          />
          <PermissionProvider access={{ permissions: ["users.create"] }}>
            <PlaygroundPanel header="Live Sandbox">
              <div className="flex flex-col gap-4">
                <div className="bg-surface-elevated/40 border border-border-subtle rounded-lg p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-dark mb-1">
                    User Access
                  </span>
                  <div className="flex gap-2 font-mono text-xs text-accent">
                    <span>users.create</span>
                  </div>
                </div>

                <div className="p-3 border border-border-subtle rounded-lg bg-surface">
                  <span className="block text-[10px] font-semibold text-muted mb-2">Check: Any of [users.create, users.delete]</span>
                  <Can permission={{ any: ["users.create", "users.delete"] }}
                    fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                    <span className="text-sm text-success font-medium">✓ Access Granted (has users.create)</span>
                  </Can>
                </div>

                <div className="p-3 border border-border-subtle rounded-lg bg-surface">
                  <span className="block text-[10px] font-semibold text-muted mb-2">Check: All of [users.create, users.delete]</span>
                  <Can permission={{ all: ["users.create", "users.delete"] }}
                    fallback={<span className="text-sm text-danger font-medium">✗ Access Denied (missing users.delete)</span>}>
                    <span className="text-sm text-success font-medium">✓ Access Granted</span>
                  </Can>
                </div>
              </div>
            </PlaygroundPanel>
          </PermissionProvider>
        </div>
      </section>
    </div>
  );
}
