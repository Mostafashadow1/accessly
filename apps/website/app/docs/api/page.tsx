"use client";

import { CodeBlock } from "@/components/ui/code-block";

export default function ApiReference() {
  return (
    <div>
      <h1 className="text-[26px] font-bold mb-2">API Reference</h1>
      <p className="text-[14px] mb-8 text-secondary">
        Complete API surface for Accessly.
      </p>

      <h2 className="text-[18px] font-semibold mb-3">PermissionProvider</h2>
      <p className="text-[13px] mb-3 text-secondary">
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

      <div className="overflow-x-auto rounded-lg border border-surface my-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b-surface">
              <th className="text-left px-4 py-3 font-semibold text-tertiary">Prop</th>
              <th className="text-left px-4 py-3 font-semibold text-tertiary">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-tertiary">Description</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["access", "AccessModel", "Direct access model (takes precedence over source+adapter)"],
              ["source", "TSource", "Raw backend response"],
              ["adapter", "AccessAdapter", "Normalizer for source"],
              ["loading", "boolean", "Show loading state"],
            ] as const).map(([prop, type, desc]) => (
              <tr key={prop} className="border-b-surface">
                <td className="px-4 py-3"><code className="text-code-key text-[12px]">{prop}</code></td>
                <td className="px-4 py-3"><code className="text-code-string text-[12px]">{type}</code></td>
                <td className="px-4 py-3 text-secondary">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-[18px] font-semibold mb-3 mt-8">Can</h2>
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

      <h2 className="text-[18px] font-semibold mb-3 mt-8">Cannot</h2>
      <CodeBlock
        title="Cannot"
        code={`<Cannot permission="users.delete">
  <UpgradeMessage />
</Cannot>`}
      />

      <h2 className="text-[18px] font-semibold mb-3 mt-8">ProtectedRoute</h2>
      <CodeBlock
        title="ProtectedRoute"
        code={`<ProtectedRoute
  permission="pages.users"
  fallback={<Forbidden />}
>
  <UsersPage />
</ProtectedRoute>`}
      />

      <h2 className="text-[18px] font-semibold mb-3 mt-8">Hooks</h2>
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
