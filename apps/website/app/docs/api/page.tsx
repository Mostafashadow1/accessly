"use client";

import { CodeBlock } from "@/components/ui/code-block";

export default function ApiReference() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-[11px] font-semibold tracking-[0.06em] uppercase mb-4">
          API Reference
        </span>
        <h1 className="text-3xl md:text-[40px] font-bold -tracking-[0.03em] text-foreground mb-3">
          API Reference
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-2xl">
          Complete programmatic API specification for Accessly context providers, components, hooks, and helpers.
        </p>
      </div>

      <div className="flex flex-col">
        {/* PermissionProvider */}
        <section className="border-b border-border-light pb-12 mb-12 last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              1
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              PermissionProvider
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
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

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Prop</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Type</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Description</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["access", "AccessModel", "Direct AccessModel state (bypasses source/adapter evaluations)"],
                  ["source", "unknown", "Raw authorization payload response returned from any REST/GraphQL endpoint"],
                  ["adapter", "AccessAdapter", "Function that normalizes raw source schema to standardized AccessModel"],
                  ["rolePermissions", "Record<string, string[]>", "Mappings of role identifier arrays to permission arrays"],
                  ["loading", "boolean", "Global loading toggle; disables child checks if loading state is true"],
                ] as const).map(([prop, type, desc]) => (
                  <tr key={prop} className="hover:bg-primary/5 transition-colors">
                    <td className="px-5 py-3.5 border-b border-border/50">
                      <code className="text-accent font-mono text-xs">{prop}</code>
                    </td>
                    <td className="px-5 py-3.5 border-b border-border/50">
                      <code className="text-success font-mono text-xs">{type}</code>
                    </td>
                    <td className="px-5 py-3.5 border-b border-border/50 text-muted text-[13px] leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Can */}
        <section className="border-b border-border-light pb-12 mb-12 last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              2
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              Can
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
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
        <section className="border-b border-border-light pb-12 mb-12 last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              3
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              Cannot
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
            The inverse of <code className="text-xs font-mono text-accent">&lt;Can&gt;</code>. Render fallback/child options only if permissions check fails.
          </p>
          <CodeBlock
            title="Cannot Component Usage"
            code={`<Cannot permission="users.delete">
  <p className="banner">Upgrade to business tier to enable delete actions.</p>
</Cannot>`}
          />
        </section>

        {/* ProtectedRoute */}
        <section className="border-b border-border-light pb-12 mb-12 last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              4
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              ProtectedRoute
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
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

        {/* React Hooks */}
        <section className="border-b border-border-light pb-12 mb-12 last:border-b-0 last:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent font-bold font-mono text-sm">
              5
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground -tracking-[0.02em]">
              React Hooks
            </h2>
          </div>
          <p className="text-[14px] text-muted leading-relaxed mb-5">
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
