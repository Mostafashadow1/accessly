import type React from "react";
import type { Metadata } from "next";
import { accesslyScenarios } from "@/data/scenarios";
import { ScenarioRunner } from "@/components/scenarios/scenario-runner";

export const metadata: Metadata = {
  title: "Use Cases | Accessly",
  description: "A validation matrix and lightweight scenario packs for Accessly APIs.",
};

type CoverageStatus = "Stable" | "Partial" | "Missing";

type UseCaseRow = {
  category: string;
  useCase: string;
  api: string;
  example: string;
  expected: string;
  status: CoverageStatus;
  notes: string;
};

const publicExports = [
  "AccessModel",
  "AccessDecision",
  "NavigationItem",
  "RolePermissions",
  "PermissionCheckInput",
  "PermissionProviderProps",
  "AccessAdapter",
  "checkPermission",
  "matchPermission",
  "createAdapter",
  "createActionsAdapter",
  "directPermissionsAdapter",
  "featureFlagsAdapter",
  "nestedModulesAdapter",
  "pagesOnlyAdapter",
  "PermissionProvider",
  "usePermission",
  "useAccessModel",
  "useAccessDecision",
  "Can",
  "Cannot",
  "ProtectedRoute",
  "filterNavigation",
  "useFilteredNavigation",
  "formatDecision",
  "inspectAccess",
] as const;

const useCaseRows: UseCaseRow[] = [
  {
    category: "Types",
    useCase: "AccessModel",
    api: "AccessModel",
    example: "{ user, permissions, flags, navigation, isLoading }",
    expected: "Shared normalized model for providers, hooks, adapters, navigation, and debug tools.",
    status: "Stable",
    notes: "Scenario packs show normalized AccessModel objects.",
  },
  {
    category: "Types",
    useCase: "AccessDecision",
    api: "AccessDecision",
    example: "{ allowed, reason, missing, matched, checkedFrom }",
    expected: "Detailed result for allowed, denied, loading, unknown, and invalid checks.",
    status: "Stable",
    notes: "Scenario checks list expected decision fields.",
  },
  {
    category: "Types",
    useCase: "NavigationItem",
    api: "NavigationItem",
    example: "{ label, href, permission, children }",
    expected: "Typed navigation can be filtered by permission.",
    status: "Stable",
    notes: "Covered by flat and nested navigation rows.",
  },
  {
    category: "Types",
    useCase: "RolePermissions",
    api: "RolePermissions",
    example: "{ admin: ['users.*'] }",
    expected: "Provider and engine can expand role permissions during checks.",
    status: "Stable",
    notes: "Covered as provider and engine configuration.",
  },
  {
    category: "Types",
    useCase: "PermissionCheckInput",
    api: "PermissionCheckInput",
    example: "{ permission } | { any } | { all } | { flag }",
    expected: "One typed input shape powers engine, hooks, and components.",
    status: "Stable",
    notes: "All four variants are covered below.",
  },
  {
    category: "Types",
    useCase: "PermissionProviderProps",
    api: "PermissionProviderProps",
    example: "access, source, adapter, loading, registry",
    expected: "Documents the provider boundary and optional normalization path.",
    status: "Stable",
    notes: "Loading, adapter, role, and unknown-permission rows cover important props.",
  },
  {
    category: "Types",
    useCase: "AccessAdapter",
    api: "AccessAdapter",
    example: "{ normalize: (source) => AccessModel }",
    expected: "Custom adapters expose a normalize function.",
    status: "Stable",
    notes: "Covered by createAdapter and backend normalization.",
  },
  {
    category: "Engine",
    useCase: "Direct permission allowed",
    api: "checkPermission / Can / usePermission",
    example: "users.create",
    expected: "Allowed when the model contains users.create.",
    status: "Stable",
    notes: "Covers direct checkedFrom metadata.",
  },
  {
    category: "Engine",
    useCase: "Missing permission denied",
    api: "checkPermission / Cannot",
    example: "billing.manage",
    expected: "Denied with missing_permission.",
    status: "Stable",
    notes: "Used for hidden or disabled UI.",
  },
  {
    category: "Engine",
    useCase: "Wildcard allowed",
    api: "matchPermission / checkPermission",
    example: "users.* -> users.create",
    expected: "Allowed with checkedFrom wildcard.",
    status: "Stable",
    notes: "Admin and GitHub scenarios cover single-level wildcard checks.",
  },
  {
    category: "Engine",
    useCase: "Nested wildcard allowed",
    api: "matchPermission / checkPermission",
    example: "users.profile.* -> users.profile.edit",
    expected: "Allowed when wildcard and target have the same segment depth.",
    status: "Stable",
    notes: "Admin scenario covers this real matching rule.",
  },
  {
    category: "Engine",
    useCase: "any[] allowed",
    api: "checkPermission / Can",
    example: "{ any: ['media.upload', 'media.manage'] }",
    expected: "Allowed when at least one permission matches.",
    status: "Stable",
    notes: "CMS scenario validates this.",
  },
  {
    category: "Engine",
    useCase: "any[] denied",
    api: "checkPermission",
    example: "{ any: ['media.delete', 'media.admin'] }",
    expected: "Denied when no requested permission matches.",
    status: "Stable",
    notes: "CMS scenario includes the denied branch.",
  },
  {
    category: "Engine",
    useCase: "all[] allowed",
    api: "checkPermission / Can",
    example: "{ all: ['posts.update', 'posts.publish'] }",
    expected: "Allowed only when every permission matches.",
    status: "Stable",
    notes: "CMS scenario validates this.",
  },
  {
    category: "Engine",
    useCase: "all[] denied",
    api: "checkPermission",
    example: "{ all: ['posts.publish', 'posts.delete'] }",
    expected: "Denied with missing_permission when any requirement is missing.",
    status: "Stable",
    notes: "CMS scenario includes the denied branch.",
  },
  {
    category: "Engine",
    useCase: "Feature flag allowed",
    api: "checkPermission / Can",
    example: "features.auditLog",
    expected: "Allowed with checkedFrom flag.",
    status: "Stable",
    notes: "Admin, SaaS, and HR scenarios include enabled flags.",
  },
  {
    category: "Engine",
    useCase: "Feature flag denied",
    api: "checkPermission / Can",
    example: "features.newCheckout",
    expected: "Denied with missing_flag.",
    status: "Stable",
    notes: "E-commerce scenario covers disabled flag behavior.",
  },
  {
    category: "Engine",
    useCase: "Unknown permission strategy",
    api: "checkPermission",
    example: "unknownPermission='throw'",
    expected: "Returns unknown_permission for unregistered denied checks.",
    status: "Stable",
    notes: "Covered in the matrix as validation behavior.",
  },
  {
    category: "Provider",
    useCase: "Provider boundary",
    api: "PermissionProvider",
    example: "<PermissionProvider access={access}>",
    expected: "Makes the current AccessModel available to components and hooks.",
    status: "Stable",
    notes: "Scenario snippets wrap UI with PermissionProvider.",
  },
  {
    category: "Provider",
    useCase: "Loading state",
    api: "PermissionProvider / Can / ProtectedRoute",
    example: "loading={true}",
    expected: "Returns not_ready and renders loading or fallback UI.",
    status: "Stable",
    notes: "Covered for component and route gating.",
  },
  {
    category: "React components",
    useCase: "Can with children",
    api: "Can",
    example: "<Can permission='orders.fulfill'>",
    expected: "Renders children when the check is allowed.",
    status: "Stable",
    notes: "Admin, CMS, HR, and E-commerce snippets use children.",
  },
  {
    category: "React components",
    useCase: "Can with fallback",
    api: "Can",
    example: "fallback={<button disabled />}",
    expected: "Renders fallback when denied or not ready.",
    status: "Stable",
    notes: "E-commerce snippet covers disabled fallback UI.",
  },
  {
    category: "React components",
    useCase: "Can render prop with decision",
    api: "Can",
    example: "{(decision) => <Denied reason={decision.reason} />}",
    expected: "Receives the full AccessDecision for custom UI.",
    status: "Stable",
    notes: "Documented in the matrix as the render-prop path.",
  },
  {
    category: "React components",
    useCase: "Cannot basic",
    api: "Cannot",
    example: "<Cannot permission='salary.view'>",
    expected: "Renders children when the check is denied.",
    status: "Stable",
    notes: "HR and CMS scenarios cover denied UI.",
  },
  {
    category: "React components",
    useCase: "Cannot with flag",
    api: "Cannot",
    example: "<Cannot permission={{ flag: 'features.compensation' }}>",
    expected: "Renders children when a feature flag is missing.",
    status: "Stable",
    notes: "HR scenario covers a denied flag check.",
  },
  {
    category: "React components",
    useCase: "ProtectedRoute fallback",
    api: "ProtectedRoute",
    example: "fallback={<Denied />}",
    expected: "Renders route fallback when denied.",
    status: "Stable",
    notes: "SaaS and GitHub scenarios cover route checks.",
  },
  {
    category: "React components",
    useCase: "ProtectedRoute loading",
    api: "ProtectedRoute",
    example: "loading={<Spinner />}",
    expected: "Renders loading UI while the provider is not ready.",
    status: "Stable",
    notes: "Covered with provider loading behavior.",
  },
  {
    category: "Hooks",
    useCase: "usePermission boolean",
    api: "usePermission",
    example: "usePermission('exports.enterprise')",
    expected: "Returns a boolean for custom controls.",
    status: "Stable",
    notes: "SaaS scenario covers disabled button logic.",
  },
  {
    category: "Hooks",
    useCase: "useAccessDecision detailed result",
    api: "useAccessDecision",
    example: "useAccessDecision('repo.settings.manage')",
    expected: "Returns allowed, reason, missing, matched, and checkedFrom.",
    status: "Stable",
    notes: "Used for denied explanations and debugging.",
  },
  {
    category: "Hooks",
    useCase: "useAccessModel reading current model",
    api: "useAccessModel",
    example: "const model = useAccessModel()",
    expected: "Reads the current normalized AccessModel from context.",
    status: "Stable",
    notes: "Covered as a model inspection use case.",
  },
  {
    category: "Navigation",
    useCase: "filterNavigation flat nav",
    api: "filterNavigation",
    example: "[{ label: 'Billing', permission: 'billing.manage' }]",
    expected: "Returns only accessible top-level navigation items.",
    status: "Stable",
    notes: "Sidebar filtering is explicitly covered.",
  },
  {
    category: "Navigation",
    useCase: "filterNavigation nested nav",
    api: "filterNavigation",
    example: "{ children: [{ permission: 'settings.read' }] }",
    expected: "Filters children and skips parents with no visible children.",
    status: "Stable",
    notes: "Covers nested NavigationItem behavior.",
  },
  {
    category: "Navigation",
    useCase: "useFilteredNavigation context nav",
    api: "useFilteredNavigation",
    example: "useFilteredNavigation(items, model)",
    expected: "Memoizes filtered navigation for React components.",
    status: "Stable",
    notes: "Covered as the hook wrapper around filterNavigation.",
  },
  {
    category: "Adapters",
    useCase: "createAdapter custom backend",
    api: "createAdapter / AccessAdapter",
    example: "createAdapter((source) => ({ permissions: source.perms }))",
    expected: "Normalizes custom backend data to AccessModel.",
    status: "Stable",
    notes: "Backend normalization row links to this utility.",
  },
  {
    category: "Adapters",
    useCase: "createActionsAdapter mapping actions",
    api: "createActionsAdapter",
    example: "{ posts: ['read', 'publish'] }",
    expected: "Maps grouped actions to posts.read and posts.publish permissions.",
    status: "Stable",
    notes: "Built-in adapter coverage.",
  },
  {
    category: "Adapters",
    useCase: "directPermissionsAdapter",
    api: "directPermissionsAdapter",
    example: "{ permissions, roles, flags }",
    expected: "Maps flat backend fields directly.",
    status: "Stable",
    notes: "Built-in adapter coverage.",
  },
  {
    category: "Adapters",
    useCase: "featureFlagsAdapter",
    api: "featureFlagsAdapter",
    example: "{ features: { auditLog: true } }",
    expected: "Maps enabled features to flags.",
    status: "Stable",
    notes: "Built-in adapter coverage.",
  },
  {
    category: "Adapters",
    useCase: "nestedModulesAdapter",
    api: "nestedModulesAdapter",
    example: "{ posts: { publish: true } }",
    expected: "Maps nested booleans to permissions.",
    status: "Stable",
    notes: "Built-in adapter coverage.",
  },
  {
    category: "Adapters",
    useCase: "pagesOnlyAdapter",
    api: "pagesOnlyAdapter",
    example: "{ pages: ['admin'] }",
    expected: "Maps pages to pages.admin permissions.",
    status: "Stable",
    notes: "Built-in adapter coverage.",
  },
  {
    category: "Debug",
    useCase: "formatDecision",
    api: "formatDecision",
    example: "formatDecision(decision)",
    expected: "Formats an AccessDecision for readable debugging output.",
    status: "Stable",
    notes: "Supports denied explanation workflows.",
  },
  {
    category: "Debug",
    useCase: "inspectAccess",
    api: "inspectAccess",
    example: "inspectAccess(model)",
    expected: "Summarizes the current model, roles, permissions, flags, and loading state.",
    status: "Stable",
    notes: "Pairs with useAccessModel and backend normalization debugging.",
  },
  {
    category: "UI scenarios",
    useCase: "Fallback UI",
    api: "Can / Cannot / ProtectedRoute",
    example: "fallback={<Denied />}",
    expected: "Shows alternate UI when denied or not ready.",
    status: "Stable",
    notes: "E-commerce scenario uses disabled fallback.",
  },
  {
    category: "UI scenarios",
    useCase: "Denied explanation",
    api: "useAccessDecision / formatDecision",
    example: "payments.refund",
    expected: "Shows reason and missing permission details.",
    status: "Stable",
    notes: "Scenario checks include expected denial reasons.",
  },
  {
    category: "UI scenarios",
    useCase: "Backend normalization",
    api: "createAdapter and built-in adapters",
    example: "backend roles, permissions, flags",
    expected: "Produces one AccessModel shape for React APIs.",
    status: "Stable",
    notes: "Scenario access models are normalized outputs.",
  },
  {
    category: "UI scenarios",
    useCase: "Sidebar filtering",
    api: "filterNavigation / useFilteredNavigation",
    example: "settings.manage",
    expected: "Hides nav items the user cannot access.",
    status: "Stable",
    notes: "Preview cards include visible and hidden nav states.",
  },
  {
    category: "UI scenarios",
    useCase: "Field-level hiding",
    api: "Can / Cannot",
    example: "salary.view",
    expected: "Hides restricted fields while keeping layout explicit.",
    status: "Stable",
    notes: "HR scenario covers salary hiding.",
  },
  {
    category: "UI scenarios",
    useCase: "Disabled action button",
    api: "usePermission / Can fallback",
    example: "payments.refund",
    expected: "Disables an action while preserving denied context.",
    status: "Stable",
    notes: "SaaS and E-commerce scenarios cover this.",
  },
];

const missingCoverage = useCaseRows.filter((row) => row.status === "Missing");
const partialCoverage = useCaseRows.filter((row) => row.status === "Partial");
const categories = Array.from(new Set(useCaseRows.map((row) => row.category)));

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-md border border-primary/20 bg-primary-light px-2 py-0.5 text-[11px] font-medium text-accent">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: CoverageStatus }) {
  const className =
    status === "Stable"
      ? "border-success/20 bg-success-subtle text-success"
      : status === "Partial"
        ? "border-warning/20 bg-warning-subtle text-warning"
        : "border-danger/20 bg-danger-subtle text-danger";

  return (
    <span className={`rounded-md border px-2 py-0.5 text-xs ${className}`}>
      {status}
    </span>
  );
}

export default function UseCasesPage() {
  return (
    <article className="mx-auto w-full max-w-7xl">
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          Validation
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Use Case Coverage
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-7 text-muted">
          A compact matrix for the important Accessly APIs, followed by small
          data-driven scenario packs. These are validation examples, not
          standalone demo apps.
        </p>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface/55 p-5">
          <div className="text-2xl font-semibold text-foreground">
            {publicExports.length}
          </div>
          <div className="mt-1 text-sm text-muted">public exports covered</div>
        </div>
        <div className="rounded-xl border border-border bg-surface/55 p-5">
          <div className="text-2xl font-semibold text-foreground">
            {useCaseRows.length}
          </div>
          <div className="mt-1 text-sm text-muted">matrix rows</div>
        </div>
        <div className="rounded-xl border border-border bg-surface/55 p-5">
          <div className="text-2xl font-semibold text-foreground">
            {accesslyScenarios.length}
          </div>
          <div className="mt-1 text-sm text-muted">scenario packs</div>
        </div>
        <div className="rounded-xl border border-border bg-surface/55 p-5">
          <div className="text-2xl font-semibold text-foreground">
            {missingCoverage.length}
          </div>
          <div className="mt-1 text-sm text-muted">missing items</div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Use Case Matrix
            </h2>
            <p className="mt-1 text-sm text-muted">
              Grouped by API area and checked against the Accessly V1 public exports.
            </p>
          </div>
          <Badge>{categories.length} categories</Badge>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface/55">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="bg-surface-elevated text-xs uppercase text-muted-dark">
              <tr>
                <th className="border-b border-border px-4 py-3 font-semibold">Category</th>
                <th className="border-b border-border px-4 py-3 font-semibold">Use case</th>
                <th className="border-b border-border px-4 py-3 font-semibold">API used</th>
                <th className="border-b border-border px-4 py-3 font-semibold">Example permission/flag</th>
                <th className="border-b border-border px-4 py-3 font-semibold">Expected result</th>
                <th className="border-b border-border px-4 py-3 font-semibold">Status</th>
                <th className="border-b border-border px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {useCaseRows.map((row) => (
                <tr key={`${row.category}-${row.useCase}`} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 text-xs font-semibold uppercase text-muted-dark">{row.category}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{row.useCase}</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">{row.api}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{row.example}</td>
                  <td className="px-4 py-3 text-muted">{row.expected}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12 rounded-xl border border-border bg-surface/55 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Missing Coverage
          </h2>
          <Badge>{missingCoverage.length} missing</Badge>
        </div>
        {missingCoverage.length === 0 && partialCoverage.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted">
            No missing or partial coverage found in the current Accessly V1
            public API audit. Rows marked Stable are represented by the matrix,
            scenario packs, or docs-page references.
          </p>
        ) : (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            {[...partialCoverage, ...missingCoverage].map((row) => (
              <li key={`${row.category}-${row.useCase}`}>
                {row.useCase}: {row.notes}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Lightweight Scenario Packs
          </h2>
          <Badge>{accesslyScenarios.length} scenarios</Badge>
        </div>
        <ScenarioRunner scenarios={accesslyScenarios} />
      </section>
    </article>
  );
}
