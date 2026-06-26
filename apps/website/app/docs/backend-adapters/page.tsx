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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          Backend Adapters
        </h1>
        <p className="text-base text-muted leading-relaxed max-w-2xl">
          Every backend returns authorization data in its own custom format. Accessly uses lightweight adapters to normalize any response structure into a standard AccessModel shape.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">1</span>
            <h2 className="text-xl font-semibold text-foreground">
              createActionsAdapter
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
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

        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">2</span>
            <h2 className="text-xl font-semibold text-foreground">
              pagesOnlyAdapter
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
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

        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">3</span>
            <h2 className="text-xl font-semibold text-foreground">
              nestedModulesAdapter
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
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

        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">4</span>
            <h2 className="text-xl font-semibold text-foreground">
              featureFlagsAdapter
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
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

        <section className="pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">5</span>
            <h2 className="text-xl font-semibold text-foreground">
              Custom Adaption
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            If your backend returns a highly custom or deeply nested data shape, use the base <code className="text-xs font-mono">createAdapter</code> function to write a custom mapper.
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

