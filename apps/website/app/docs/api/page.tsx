"use client";

import { CodeBlock } from "@/components/ui/code-block";

export default function ApiReference() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          API Reference
        </h1>
        <p className="text-base text-muted leading-relaxed max-w-2xl">
          Complete programmatic API specification for Accessly context providers, components, hooks, and helpers.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* PermissionProvider */}
        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">1</span>
            <h2 className="text-xl font-semibold text-foreground">
              PermissionProvider
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            The root React Context Provider that stores active access models, roles mappings, and handles validation rules.
          </p>
          <CodeBlock
            title="PermissionProvider"
            code={`<PermissionProvider
  access={access}          // Direct AccessModel object
  source={response}        // Raw backend JSON response
  adapter={adapter}        // Optional adapter function to map source to access
  rolePermissions={roles}  // Key-value role to permission lists
  registry={[]}            // Known permission lists (for validation checks)
  unknownPermission="warn" // "ignore" | "warn" | "throw"
  loading={false}          // Renders children as locked during loading states
>
  <App />
</PermissionProvider>`}
          />

          <div className="overflow-x-auto rounded-xl border border-border bg-[#08080a] my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-hover/40">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Prop</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {([
                  ["access", "AccessModel", "Direct AccessModel state (bypasses source/adapter evaluations)"],
                  ["source", "unknown", "Raw authorization payload response returned from any REST/GraphQL endpoint"],
                  ["adapter", "AccessAdapter", "Function that normalizes raw source schema to standardized AccessModel"],
                  ["rolePermissions", "Record<string, string[]>", "Mappings of role identifier arrays to permission arrays"],
                  ["loading", "boolean", "Global loading toggle; disables child checks if loading state is true"],
                ] as const).map(([prop, type, desc]) => (
                  <tr key={prop} className="hover:bg-surface-hover/10 transition-colors">
                    <td className="px-5 py-3">
                      <code className="text-accent text-xs font-mono">{prop}</code>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-success text-xs font-mono">{type}</code>
                    </td>
                    <td className="px-5 py-3 text-muted text-xs leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Can */}
        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">2</span>
            <h2 className="text-xl font-semibold text-foreground">
              Can
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            UI component to conditionally render parts of your page based on permissions.
          </p>
          <CodeBlock
            title="Can Component Usage"
            code={`<Can permission="users.create">
  <button>Create User</button>
</Can>

<Can
  permission={{ any: ["users.create", "users.delete"] }}
  fallback={<p className="error">Unauthorized</p>}
>
  <AdminPanel />
</Can>`}
          />
        </section>

        {/* Cannot */}
        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">3</span>
            <h2 className="text-xl font-semibold text-foreground">
              Cannot
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            The inverse of <code className="text-xs font-mono">&lt;Can&gt;</code>. Render fallback/child options only if permissions check fails.
          </p>
          <CodeBlock
            title="Cannot Component Usage"
            code={`<Cannot permission="users.delete">
  <p className="banner">Upgrade to business tier to enable delete actions.</p>
</Cannot>`}
          />
        </section>

        {/* ProtectedRoute */}
        <section className="border-b border-border-light pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">4</span>
            <h2 className="text-xl font-semibold text-foreground">
              ProtectedRoute
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Protect routes without tying logic to specific routing libraries (e.g. React Router, Next.js).
          </p>
          <CodeBlock
            title="ProtectedRoute Usage"
            code={`<ProtectedRoute
  permission="pages.admin"
  fallback={<ForbiddenPage />}
>
  <AdminDashboard />
</ProtectedRoute>`}
          />
        </section>

        {/* Hooks */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-mid border border-primary text-accent font-bold font-mono text-sm">5</span>
            <h2 className="text-xl font-semibold text-foreground">
              React Hooks
            </h2>
          </div>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Access evaluations imperatively using hooks inside your React components.
          </p>
          <CodeBlock
            title="React Hooks API"
            code={`// Check simple boolean checks
const isAllowed = usePermission("users.create");
// returns true or false

// Retrieve full debugging info (reason, matched roles, direct/wildcard classification)
const decision = useAccessDecision("users.create");
/* returns:
  {
    allowed: true,
    reason: "allowed",
    matched: ["users.create"],
    checkedFrom: "direct"
  }
*/

// Retrieve raw AccessModel data from provider context
const model = useAccessModel();
// returns: { permissions: [...], flags: [...] }`}
          />
        </section>
      </div>
    </div>
  );
}

