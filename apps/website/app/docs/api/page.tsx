"use client";

import { CodeBlock } from "@/components/ui/code-block";

export default function ApiReference() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">API Reference</h1>
      <p className="text-sm text-muted mb-8">
        Complete API surface for Accessly.
      </p>

      <h2 className="text-lg font-semibold text-foreground mb-3">PermissionProvider</h2>
      <p className="text-sm text-muted mb-3">
        The root context provider for all Accessly features.
      </p>
      <CodeBlock
        title="PermissionProvider"
        code={`<PermissionProvider
  access={access}          // Direct AccessModel
  source={response}        // Raw backend response
  adapter={adapter}        // Normalizer function
  rolePermissions={roles}  // Role-to-permissions map
  registry={[]}            // Known permission registry
  unknownPermission="warn" // "ignore" | "warn" | "throw"
  loading                  // Show loading state
>
  <App />
</PermissionProvider>`}
      />

      <div className="overflow-x-auto rounded-lg border border-border my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-dark">Prop</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-dark">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-dark">Description</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["access", "AccessModel", "Direct access model (takes precedence over source+adapter)"],
              ["source", "TSource", "Raw backend response"],
              ["adapter", "AccessAdapter", "Normalizer for source"],
              ["loading", "boolean", "Show loading state"],
            ] as const).map(([prop, type, desc]) => (
              <tr key={prop} className="border-b border-border">
                <td className="px-4 py-3"><code className="text-accent text-xs font-mono">{prop}</code></td>
                <td className="px-4 py-3"><code className="text-success text-xs font-mono">{type}</code></td>
                <td className="px-4 py-3 text-muted">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Can</h2>
      <CodeBlock
        title="Can"
        code={`<Can permission="users.create">
  <CreateButton />
</Can>

<Can permission="users.delete"
  fallback={<button disabled>Delete</button>}>
  <button>Delete</button>
</Can>`}
      />

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Cannot</h2>
      <CodeBlock
        title="Cannot"
        code={`<Cannot permission="users.delete">
  <UpgradeMessage />
</Cannot>`}
      />

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">ProtectedRoute</h2>
      <CodeBlock
        title="ProtectedRoute"
        code={`<ProtectedRoute
  permission="pages.users"
  fallback={<Forbidden />}
>
  <UsersPage />
</ProtectedRoute>`}
      />

      <h2 className="text-lg font-semibold text-foreground mb-3 mt-8">Hooks</h2>
      <CodeBlock
        title="usePermission / useAccessDecision"
        code={`const allowed = usePermission("users.create");
// true

const result = useAccessDecision("users.create");
// { allowed: true, reason: "allowed", ... }

const model = useAccessModel();
// { permissions: [...], flags: [...], ... }`}
      />
    </div>
  );
}
