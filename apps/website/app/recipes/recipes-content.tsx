"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { FeaturePill } from "@/components/ui/feature-pill";

// Recipe categories with their badge colors
interface RecipeItem {
  title: string;
  category: string;
  description: string;
  codeTitle: string;
  code: string;
  categoryClass: string;
}

const allRecipes: RecipeItem[] = [
  {
    title: "RBAC with Role Permissions",
    category: "RBAC",
    description: "Map static roles (admin, manager, viewer) to lists of permissions. Let the provider handle evaluation internally.",
    codeTitle: "rbac-setup.tsx",
    code: `const rolePermissions = {
  admin: ["*"],
  manager: ["pages.users", "users.view", "users.create"],
  employee: ["pages.dashboard"]
};

<PermissionProvider
  access={{
    user: { roles: ["manager"] },
    permissions: []
  }}
  rolePermissions={rolePermissions}
>
  <Can permission="users.create">
    <CreateUserButton />
  </Can>
</PermissionProvider>`,
    categoryClass: "text-info bg-info-bg border border-info/20"
  },
  {
    title: "Backend Integration with Adapter",
    category: "ADAPTERS",
    description: "Write custom adapter functions to transform complex, multi-nested REST or GraphQL API responses into flat permission keys.",
    codeTitle: "api-adapter.ts",
    code: `import { createAdapter } from "accessly";

const ACTION_MAP = {
  VIEW_USERS: "pages.users",
  CREATE_USER: "users.create",
  DELETE_USER: "users.delete",
};

const adapter = createAdapter((apiResponse) => ({
  user: {
    id: apiResponse.currentUser.id,
    roles: [apiResponse.currentUser.userType.toLowerCase()],
  },
  permissions: apiResponse.currentUser.allowedActions
    .map((action) => ACTION_MAP[action])
    .filter(Boolean),
}));

// Usage:
<PermissionProvider source={apiResponse} adapter={adapter}>
  <App />
</PermissionProvider>`,
    categoryClass: "text-success bg-success-bg border border-success/20"
  },
  {
    title: "Loading State Pattern",
    category: "UX PATTERNS",
    description: "Prevent flashing or premature denied states while fetching permission graphs from the database during startup.",
    codeTitle: "loading-gate.tsx",
    code: `function App() {
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(null);

  useEffect(() => {
    fetchPermissions()
      .then(setAccess)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PermissionProvider access={access} loading={loading}>
      <AppContent />
    </PermissionProvider>
  );
}

// Note: While loading, all Can gates block
// and return false, showing the fallback UI.`,
    categoryClass: "text-warning bg-warning-bg border border-warning/20"
  },
  {
    title: "Debug Console Logging",
    category: "DIAGNOSTICS",
    description: "Use standard formatting utilities to log permissions evaluation trees directly inside your console or error tracing scripts.",
    codeTitle: "diagnostic-logs.ts",
    code: `import { inspectAccess, formatDecision } from "accessly";

console.log(inspectAccess(model));
// Output:
// User: usr_90210
// Roles: manager
// Permissions: users.create, pages.dashboard

const decision = useAccessDecision("users.create");
console.log(formatDecision(decision));
// Output:
// Allowed: true
// Reason: allowed
// Matched: users.create
// Checked from: direct`,
    categoryClass: "text-danger bg-danger-bg border border-danger/20"
  },
  {
    title: "Wildcard Permission Rules",
    category: "PATTERNS",
    description: "Configure permissions using asterisks to grant full access to nested namespace layers without listing individual items.",
    codeTitle: "wildcard-rules.ts",
    code: `// Single-level wildcard expansion
// "users.*" matches "users.create", "users.delete"
// Does NOT match "users.profile.edit"

const model = {
  permissions: ["users.*", "reports.view"]
};

// Evaluates to allowed: true
checkPermission(model, {
  permission: "users.create"
});
// Decision returns checkedFrom: "wildcard"`,
    categoryClass: "text-accent bg-primary-light border border-primary/20"
  },
  {
    title: "Feature Flag Toggles",
    category: "FLAGS",
    description: "Gate code features, A/B routes, and trial plans using flags. Unlike permissions, flags check for binary toggles.",
    codeTitle: "feature-flags.tsx",
    code: `<PermissionProvider
  access={{
    permissions: [],
    flags: ["features.new-dashboard"]
  }}
>
  {/* Rendered only if feature flag is active */}
  <Can permission={{ flag: "features.new-dashboard" }}>
    <NewDashboard />
  </Can>

  {/* Rendered only if feature flag is disabled */}
  <Cannot permission={{ flag: "features.beta-reports" }}>
    <UpgradePrompt />
  </Cannot>
</PermissionProvider>`,
    categoryClass: "text-[#a78bfa] bg-[rgba(167,139,250,0.07)] border-[rgba(167,139,250,0.2)]"
  },
  {
    title: "Sidebar / Filtered Navigation",
    category: "NAVIGATION",
    description: "Filter multi-tier sidebar arrays. Children elements are pruned; empty parent folders are automatically hidden.",
    codeTitle: "sidebar-filter.ts",
    code: `import { filterNavigation } from "accessly";
import type { NavigationItem } from "accessly";

const navItems: NavigationItem[] = [
  { label: "Dashboard", href: "/", permission: "pages.dashboard" },
  {
    label: "Users", href: "/users", permission: "pages.users",
    children: [
      { label: "Create", href: "/users/create", permission: "users.create" },
    ]
  },
];

const model = {
  permissions: ["pages.dashboard"]
};

// Result hides "Users" since no sub-items are allowed
const filtered = filterNavigation(navItems, model);`,
    categoryClass: "text-muted bg-surface-elevated border border-border"
  },
];

// Get unique categories
const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

export function RecipesContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredRecipes = activeCategory === "All"
    ? allRecipes
    : allRecipes.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <div className="relative border-b border-border overflow-hidden py-20 md:py-28 bg-[#08080a]">
        {/* Radial Glow & Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FeaturePill label="Code Blueprints" />
          <h1 className="text-[clamp(36px,6vw,72px)] font-bold -tracking-[0.03em] leading-[1.1] text-foreground mt-4 mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Integration Recipes
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Production-ready blueprints and snippets for common access control architectures.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 mb-6">
        <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-border bg-surface-2/65 backdrop-blur-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/25 border-0"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.title} className="hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
                <span className="text-[16px] font-bold text-foreground tracking-tight">{recipe.title}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-[0.05em] ${recipe.categoryClass}`}>
                  {recipe.category}
                </span>
              </div>
              <p className="text-[13px] text-muted mb-5 leading-relaxed">
                {recipe.description}
              </p>
              <CodeBlock
                title={recipe.codeTitle}
                code={recipe.code}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
