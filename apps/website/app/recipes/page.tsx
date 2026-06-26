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
    categoryClass: "badge-info"
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
    categoryClass: "badge-success"
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
    categoryClass: "badge-warning"
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
    categoryClass: "badge-danger"
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
    categoryClass: "badge-primary"
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
    categoryClass: "badge-secondary"
  },
];

// Get unique categories
const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredRecipes = activeCategory === "All"
    ? allRecipes
    : allRecipes.filter(r => r.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <FeaturePill label="Code Blueprints" />
        <SectionHeader
          title="Integration Recipes"
          description="Production-ready blueprints and snippets for common access control architectures."
          align="center"
        />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-canvas/90 backdrop-blur-xl border-b border-border mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/20"
                  : "bg-surface text-muted border border-border hover:text-foreground hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.title} className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <span className="text-sm font-semibold text-foreground">{recipe.title}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono ${recipe.categoryClass}`}>
                {recipe.category}
              </span>
            </div>
            <p className="text-xs text-muted mb-4 leading-relaxed">
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
  );
}
