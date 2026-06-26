"use client";

import { PermissionProvider, Can } from "accessly";
import {
  createActionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featureFlagsAdapter,
} from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";

export default function BackendAdapters() {
  const actionsModel = createActionsAdapter({
    users: ["create", "delete"],
    reports: ["view"],
  });

  const pagesModel = pagesOnlyAdapter({
    pages: ["dashboard", "users", "settings"],
  });

  const nestedModel = nestedModulesAdapter({
    users: { create: true, delete: false, view: true },
  });

  const featuresModel = featureFlagsAdapter({
    features: { "new-dashboard": true, "beta-reports": false },
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-[11px] font-semibold tracking-[0.06em] uppercase mb-4">
          Backend Adapters
        </span>
        <h1 className="text-3xl md:text-[40px] font-bold -tracking-[0.03em] text-foreground mb-3">
          Backend Adapters
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-2xl">
          Every backend returns authorization data in its own custom format. Accessly uses lightweight adapters to normalize any response structure into a standard AccessModel shape.
        </p>
      </div>

      <div className="flex flex-col">
        {/* Section 1: createActionsAdapter */}
        <section className="pb-12 mb-12 border-b border-border-light last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              1
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              createActionsAdapter
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            Converts a mapping of resources to lists of actions into dot-notation strings.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
              title="createActionsAdapter"
              code={`import { createActionsAdapter } from "accessly";

const access = createActionsAdapter({
  users: ["create", "delete"],
  reports: ["view"],
});

// Output AccessModel permissions:
// ["users.create", "users.delete", "reports.view"]`}
            />
            <PermissionProvider access={actionsModel}>
              <PlaygroundPanel header="Live Normalization">
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check: Can users.create?</span>
                    <Can permission="users.create"
                      fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                      <span className="text-sm text-success font-medium">✓ Access Granted (mapped from users: [create])</span>
                    </Can>
                  </div>
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check: Can reports.view?</span>
                    <Can permission="reports.view"
                      fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                      <span className="text-sm text-success font-medium">✓ Access Granted (mapped from reports: [view])</span>
                    </Can>
                  </div>
                </div>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </section>

        {/* Section 2: pagesOnlyAdapter */}
        <section className="pb-12 mb-12 border-b border-border-light last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              2
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              pagesOnlyAdapter
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            For backends that only return high-level route or page access lists. Prepend namespace prefixes automatically.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
              title="pagesOnlyAdapter"
              code={`import { pagesOnlyAdapter } from "accessly";

const access = pagesOnlyAdapter({
  pages: ["dashboard", "users", "settings"]
});

// Output AccessModel permissions:
// ["pages.dashboard", "pages.users", "pages.settings"]`}
            />
            <PermissionProvider access={pagesModel}>
              <PlaygroundPanel header="Live Normalization">
                <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                  <span className="block text-[10px] font-semibold text-muted mb-2">Check: Can pages.dashboard?</span>
                  <Can permission="pages.dashboard"
                    fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                    <span className="text-sm text-success font-medium">✓ Access Granted (mapped prefix pages.dashboard)</span>
                  </Can>
                </div>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </section>

        {/* Section 3: nestedModulesAdapter */}
        <section className="pb-12 mb-12 border-b border-border-light last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              3
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              nestedModulesAdapter
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            For backends returning boolean toggle trees mapping modules to nested action permissions.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
              title="nestedModulesAdapter"
              code={`import { nestedModulesAdapter } from "accessly";

const access = nestedModulesAdapter({
  users: { create: true, delete: false, view: true },
});

// Output AccessModel permissions:
// ["users.create", "users.view"]`}
            />
            <PermissionProvider access={nestedModel}>
              <PlaygroundPanel header="Live Normalization">
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check: Can users.create?</span>
                    <Can permission="users.create"
                      fallback={<span className="text-sm text-danger font-medium">✗ Access Denied</span>}>
                      <span className="text-sm text-success font-medium">✓ Access Granted (users.create is true)</span>
                    </Can>
                  </div>
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check: Can users.delete?</span>
                    <Can permission="users.delete"
                      fallback={<span className="text-sm text-danger font-medium">✗ Access Denied (users.delete is false)</span>}>
                      <span className="text-sm text-success font-medium">✓ Access Granted</span>
                    </Can>
                  </div>
                </div>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </section>

        {/* Section 4: featureFlagsAdapter */}
        <section className="pb-12 mb-12 border-b border-border-light last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              4
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              featureFlagsAdapter
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            Translates feature flags or active split key responses directly into access flags.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
              title="featureFlagsAdapter"
              code={`import { featureFlagsAdapter } from "accessly";

const access = featureFlagsAdapter({
  features: { "new-dashboard": true, "beta-reports": false }
});

// Output AccessModel flags:
// ["features.new-dashboard"]`}
            />
            <PermissionProvider access={featuresModel}>
              <PlaygroundPanel header="Live Normalization">
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check Flag: features.new-dashboard</span>
                    <Can permission={{ flag: "features.new-dashboard" }}
                      fallback={<span className="text-sm text-danger font-medium">✗ Feature Disabled</span>}>
                      <span className="text-sm text-success font-medium">✓ Feature Enabled</span>
                    </Can>
                  </div>
                  <div className="p-3 bg-surface-hover/30 border border-border-light rounded-lg">
                    <span className="block text-[10px] font-semibold text-muted mb-2">Check Flag: features.beta-reports</span>
                    <Can permission={{ flag: "features.beta-reports" }}
                      fallback={<span className="text-sm text-danger font-medium">✗ Feature Disabled (beta-reports is false)</span>}>
                      <span className="text-sm text-success font-medium">✓ Feature Enabled</span>
                    </Can>
                  </div>
                </div>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </section>

        {/* Section 5: Custom Adaption */}
        <section className="pb-12 mb-12 border-b border-border-light last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              5
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              Custom Adaption
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            If your backend returns a highly custom or deeply nested data shape, use the base{" "}
            <code className="text-xs font-mono text-accent">createAdapter</code> function to write a custom mapper.
          </p>
          <CodeBlock
            title="Custom Adapter Definition"
            code={`import { createAdapter } from "accessly";

interface MyBackendResponse {
  userId: string;
  scope: string; // e.g. "read:users write:users"
}

export const myAdapter = createAdapter((apiResponse: MyBackendResponse) => ({
  user: {
    id: apiResponse.userId
  },
  permissions: apiResponse.scope.split(" ").map(scope => {
    // Map "write:users" -> "users.create"
    const [action, resource] = scope.split(":");
    return \`\${resource}.\${action === "write" ? "create" : "view"}\`;
  })
}));`}
          />
        </section>
      </div>
    </div>
  );
}
