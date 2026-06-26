"use client";

import { PermissionProvider, Can } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";

export default function CoreConcepts() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          Core Concepts
        </h1>
        <p className="text-base text-muted leading-relaxed max-w-2xl">
          Understand the internal normalized shape used by Accessly to resolve all permission rules and checks.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">1</span>
          <h2 className="text-lg font-semibold text-foreground">
            AccessModel
          </h2>
        </div>
        <p className="text-sm text-muted mb-4">
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

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">2</span>
          <h2 className="text-lg font-semibold text-foreground">
            Permission Namespaces
          </h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Accessly structures permissions as hierarchical string tokens. You can group these by pages, features, attributes, or actions using dot-notation.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-[#08080a] mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover/40">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Standard Pattern Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {([
                ["Page / Route level", "pages.dashboard"],
                ["Action / Resource level", "users.create"],
                ["Granular Field level", "users.salary.view"],
                ["Feature Flag level", "features.new-dashboard"],
              ] as const).map(([type, example]) => (
                <tr key={type} className="hover:bg-surface-hover/10 transition-colors">
                  <td className="px-5 py-3 text-foreground font-medium">{type}</td>
                  <td className="px-5 py-3">
                    <code className="text-accent text-xs font-mono">{example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">3</span>
          <h2 className="text-lg font-semibold text-foreground">
            Feature Flags Checks
          </h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Flags represent binary features (A/B testing, rollout levels, settings). Query flags directly with the <code className="text-xs font-mono">flag</code> wrapper syntax.
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
              <div className="flex flex-col items-center justify-center p-8 bg-surface-hover/20 border border-border-light rounded-lg">
                <Can permission={{ flag: "features.beta" }}>
                  <div className="flex items-center gap-2 text-success font-medium text-sm">
                    <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                    <span>✓ Beta Feature is Enabled & Active</span>
                  </div>
                </Can>
              </div>
            </PlaygroundPanel>
          </PermissionProvider>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">4</span>
          <h2 className="text-lg font-semibold text-foreground">
            Logical Checks (any / all)
          </h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Combine permission names using logical operators to grant access only if a user has at least one matching token (<code className="text-xs font-mono">any</code>) or all required tokens (<code className="text-xs font-mono">all</code>).
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
                <div className="bg-surface-elevated/40 border border-border-light rounded-lg p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-dark mb-1">
                    User Access
                  </span>
                  <div className="flex gap-2 font-mono text-xs text-accent">
                    <span>users.create</span>
                  </div>
                </div>

                <div className="p-3 border border-border-light rounded-lg bg-surface">
                  <span className="block text-[10px] font-semibold text-muted mb-2">Check: Any of [users.create, users.delete]</span>
                  <Can permission={{ any: ["users.create", "users.delete"] }}
                    fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                    <span className="text-sm text-success font-medium">✓ Access Granted (has users.create)</span>
                  </Can>
                </div>

                <div className="p-3 border border-border-light rounded-lg bg-surface">
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
