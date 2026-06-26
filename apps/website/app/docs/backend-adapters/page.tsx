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
      <h1 className="text-[26px] font-bold mb-2">Backend Adapters</h1>
      <p className="text-[14px] mb-8 text-secondary">
        Every backend returns access data differently. Accessly normalizes any backend shape into its internal model using adapters.
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[18px] font-semibold mb-3">createActionsAdapter</h2>
          <p className="text-[13px] mb-3 text-secondary">
            Converts a resource-to-actions map into dot-notation permissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeBlock
              title="createActionsAdapter"
              code={`createActionsAdapter({
  users: ["create", "delete"],
  reports: ["view"],
})
// => { permissions: ["users.create", "users.delete", "reports.view"] }`}
            />
            <PermissionProvider access={actionsModel}>
              <PlaygroundPanel header="Live check">
                <Can permission="users.create">
                  <span className="text-allowed">✓ users.create mapped</span>
                </Can>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold mb-3">pagesOnlyAdapter</h2>
          <p className="text-[13px] mb-3 text-secondary">
            For backends that only expose page-level access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeBlock
              title="pagesOnlyAdapter"
              code={`pagesOnlyAdapter({
  pages: ["dashboard", "users"]
})
// => { permissions: ["pages.dashboard", "pages.users"] }`}
            />
            <PermissionProvider access={pagesModel}>
              <PlaygroundPanel header="Live check">
                <Can permission="pages.dashboard">
                  <span className="text-allowed">✓ pages.dashboard mapped</span>
                </Can>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold mb-3">nestedModulesAdapter</h2>
          <p className="text-[13px] mb-3 text-secondary">
            For nested boolean permission structures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeBlock
              title="nestedModulesAdapter"
              code={`nestedModulesAdapter({
  users: { create: true, delete: false, view: true },
})
// => { permissions: ["users.create", "users.view"] }`}
            />
            <PermissionProvider access={nestedModel}>
              <PlaygroundPanel header="Live check">
                <Can permission="users.create">
                  <span className="text-allowed">✓ users.create (true)</span>
                </Can>
                <Can permission="users.delete"
                  fallback={<span className="text-denied">✗ users.delete (false)</span>}>
                  <span>users.delete</span>
                </Can>
              </PlaygroundPanel>
            </PermissionProvider>
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold mb-3">featureFlagsAdapter</h2>
          <p className="text-[13px] mb-3 text-secondary">
            For feature flag backends.
          </p>
          <PermissionProvider access={featuresModel}>
            <PlaygroundPanel header="Live check">
              <Can permission={{ flag: "features.new-dashboard" }}>
                <span className="text-allowed">✓ features.new-dashboard enabled</span>
              </Can>
            </PlaygroundPanel>
          </PermissionProvider>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold mb-3">Custom Adapter</h2>
          <p className="text-[13px] mb-3 text-secondary">
            Use <code className="text-code-key inline-code">createAdapter</code> to build your own normalizer for any backend shape.
          </p>
          <CodeBlock
            title="createAdapter"
            code={`import { createAdapter } from "accessly";

const adapter = createAdapter((backendResponse) => ({
  user: { id: backendResponse.userId },
  permissions: backendResponse.actions
    .map(a => a.permission),
}));`}
          />
        </div>
      </div>
    </div>
  );
}
