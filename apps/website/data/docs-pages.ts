export type DocsPageSection = {
  title: string;
  body: string;
  code?: string;
  language?: string;
};

export type DocsPage = {
  slug: string;
  title: string;
  description: string;
  sections: DocsPageSection[];
};

const publicApi = [
  "PermissionProvider",
  "Can",
  "Cannot",
  "ProtectedRoute",
  "usePermission",
  "useAccessDecision",
  "useAccessModel",
  "checkPermission",
  "matchPermission",
  "createAdapter",
  "createActionsAdapter",
  "directPermissionsAdapter",
  "featureFlagsAdapter",
  "nestedModulesAdapter",
  "pagesOnlyAdapter",
  "filterNavigation",
  "useFilteredNavigation",
  "formatDecision",
  "inspectAccess",
];

export const docsPages: DocsPage[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description:
      "Accessly is frontend access control for React UI. Start by modeling the current authenticated user's access, then render UI from that model.",
    sections: [
      {
        title: "What Accessly Does",
        body:
          "Accessly helps React apps hide, show, disable, and explain frontend UI from one normalized AccessModel. It does not replace backend authorization for private routes, data fetching, mutations, billing actions, or admin operations.",
      },
      {
        title: "Current User Only",
        body:
          "AccessModel describes the current authenticated user/session only. Do not pass every user in your system to PermissionProvider.",
      },
      {
        title: "First Shape",
        body:
          "The provider stores access data in React Context. Hooks such as usePermission and useAccessDecision read from PermissionProvider.",
        code: `import { PermissionProvider, Can } from "accessly";

const access = {
  user: { id: "user_1", roles: ["admin"] },
  permissions: ["users.create"],
  flags: ["features.audit-log"],
};

export function App() {
  return (
    <PermissionProvider access={access}>
      <Can permission="users.create">
        <button>Create user</button>
      </Can>
    </PermissionProvider>
  );
}`,
        language: "tsx",
      },
    ],
  },
  {
    slug: "installation",
    title: "Installation",
    description:
      "Install Accessly from npm, then import the public APIs you need from the accessly package.",
    sections: [
      {
        title: "Default Install",
        body:
          "Use npm by default. Other package managers are supported, but npm should be shown first in docs and examples.",
        code: `npm install accessly

pnpm add accessly
yarn add accessly
bun add accessly`,
        language: "bash",
      },
      {
        title: "React Peer Dependency",
        body:
          "Accessly expects React to be installed by your app. The package has no regular runtime dependencies.",
      },
    ],
  },
  {
    slug: "quick-start",
    title: "Quick Start",
    description:
      "Wrap your authenticated app shell in PermissionProvider and render one visible permission check.",
    sections: [
      {
        title: "Render Gated UI",
        body:
          "Use Can for declarative UI gating. This is frontend rendering only; the backend must still authorize the action.",
        code: `import { PermissionProvider, Can, Cannot } from "accessly";

export function App() {
  return (
    <PermissionProvider access={{ permissions: ["reports.view"] }}>
      <Can permission="reports.view" fallback={<span>Hidden</span>}>
        <ReportsPage />
      </Can>

      <Cannot permission="billing.manage">
        <p>Billing settings are restricted.</p>
      </Cannot>
    </PermissionProvider>
  );
}`,
        language: "tsx",
      },
    ],
  },
  {
    slug: "core-concepts",
    title: "Core Concepts",
    description:
      "The core flow is backend data to AccessModel to PermissionProvider to AccessDecision to UI.",
    sections: [
      {
        title: "AccessModel",
        body:
          "AccessModel is the normalized access shape for the current authenticated user. It may contain user roles, permissions, feature flags, navigation items, and isLoading.",
      },
      {
        title: "PermissionProvider",
        body:
          "PermissionProvider stores the model in React Context. usePermission reads from that context; checkPermission is pure and requires access data to be passed manually.",
      },
      {
        title: "Matching Rules",
        body:
          "Wildcards are optional and segment-based. Feature flags are exact-match only and are checked with { flag: 'features.name' }.",
        code: `matchPermission("users.*", "users.create"); // true
matchPermission("users.*", "users.profile.edit"); // false
checkPermission({ flags: ["features.audit"] }, { flag: "features.audit" });`,
        language: "ts",
      },
    ],
  },
  {
    slug: "react-apis",
    title: "React APIs",
    description:
      "Use PermissionProvider, components, and hooks to keep frontend checks readable and explainable.",
    sections: [
      {
        title: "Components",
        body:
          "Can renders children when allowed. Cannot renders children when denied. ProtectedRoute gates route-level UI but does not redirect automatically.",
        code: `<ProtectedRoute
  permission="pages.admin"
  fallback={<p>No access</p>}
  loading={<p>Checking access...</p>}
>
  <AdminPage />
</ProtectedRoute>`,
        language: "tsx",
      },
      {
        title: "Hooks",
        body:
          "usePermission returns a boolean. useAccessDecision returns the full decision. useAccessModel returns the current model from PermissionProvider.",
        code: `const canExport = usePermission("reports.export");
const decision = useAccessDecision("reports.export");
const model = useAccessModel();`,
        language: "tsx",
      },
    ],
  },
  {
    slug: "backend-adapters",
    title: "Backend Adapters",
    description:
      "Adapters normalize backend-specific payloads into AccessModel without changing your backend API shape.",
    sections: [
      {
        title: "Custom Adapter",
        body:
          "Use createAdapter when your backend does not already return AccessModel. Validate backend data before trusting adapter output in production.",
        code: `import { createAdapter, PermissionProvider } from "accessly";

const backendAdapter = createAdapter((source: {
  id: string;
  perms: string[];
  featureFlags: string[];
}) => ({
  user: { id: source.id },
  permissions: source.perms,
  flags: source.featureFlags,
}));

<PermissionProvider source={user} adapter={backendAdapter}>
  <App />
</PermissionProvider>;`,
        language: "tsx",
      },
      {
        title: "Built-in Adapters",
        body:
          "Use directPermissionsAdapter, createActionsAdapter, featureFlagsAdapter, nestedModulesAdapter, or pagesOnlyAdapter for common payload shapes.",
      },
    ],
  },
  {
    slug: "navigation",
    title: "Navigation",
    description:
      "Use filterNavigation or useFilteredNavigation to hide inaccessible navigation items from frontend UI.",
    sections: [
      {
        title: "Filter Links",
        body:
          "Hidden navigation is a UX behavior, not a security boundary. Backend routes still need authorization.",
        code: `import { filterNavigation } from "accessly";

const visible = filterNavigation(
  [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Billing", href: "/billing", permission: "billing.view" },
  ],
  { permissions: ["dashboard.view"] },
);`,
        language: "ts",
      },
    ],
  },
  {
    slug: "debugging",
    title: "Debugging",
    description:
      "Use decisions and debug helpers to see why UI is hidden, denied, allowed, or not ready.",
    sections: [
      {
        title: "Debug Hidden UI",
        body:
          "When UI is hidden, ask for the decision first. useAccessDecision reads from PermissionProvider. checkPermission is pure and takes the model manually.",
        code: `const decision = useAccessDecision("billing.manage");

if (!decision.allowed) {
  return <pre>{formatDecision(decision)}</pre>;
}`,
        language: "tsx",
      },
      {
        title: "Allowed Decision",
        body: "A wildcard permission can allow a concrete permission when segment counts match.",
        code: `checkPermission(
  { permissions: ["reports.*"] },
  { permission: "reports.export" },
);

// {
//   allowed: true,
//   reason: "allowed",
//   requested: ["reports.export"],
//   matched: ["reports.*"],
//   checkedFrom: "wildcard"
// }`,
        language: "ts",
      },
      {
        title: "Denied And Missing Permission",
        body:
          "A denied permission includes the requested and missing values. This is the fastest way to see why access was denied.",
        code: `checkPermission(
  { permissions: ["reports.view"] },
  { permission: "billing.manage" },
);

// {
//   allowed: false,
//   reason: "missing_permission",
//   requested: ["billing.manage"],
//   missing: ["billing.manage"],
//   checkedFrom: "none"
// }`,
        language: "ts",
      },
      {
        title: "Loading Or Not Ready",
        body:
          "If PermissionProvider is loading or no model exists yet, decisions return not_ready. Render loading UI or fallback UI explicitly.",
        code: `checkPermission(null, { permission: "reports.view" });

// { allowed: false, reason: "not_ready" }`,
        language: "ts",
      },
      {
        title: "Inspect The Model",
        body:
          "inspectAccess summarizes the active model before you debug one permission. formatDecision formats a single decision for logs or developer UI.",
        code: `console.log(inspectAccess(model));
console.log(formatDecision(decision));`,
        language: "ts",
      },
    ],
  },
  {
    slug: "api-reference",
    title: "API Reference",
    description:
      "The public API is intentionally small. Import these names from accessly.",
    sections: [
      {
        title: "Public Exports",
        body: publicApi.join(", "),
      },
      {
        title: "Types",
        body:
          "AccessModel, NavigationItem, AccessDecision, RolePermissions, PermissionCheckInput, AccessAdapter, and PermissionProviderProps are public TypeScript types.",
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    description:
      "Short answers to the questions most likely to confuse first-time Accessly users.",
    sections: [
      {
        title: "Does Accessly replace backend authorization?",
        body:
          "No. Accessly is frontend access control. Authorize sensitive operations on the backend.",
      },
      {
        title: "Do I pass all users to PermissionProvider?",
        body:
          "No. Pass the current authenticated user's AccessModel only.",
      },
      {
        title: "Does ProtectedRoute redirect automatically?",
        body:
          "No. ProtectedRoute renders children, loading, or fallback. Put router-specific redirects in your fallback if your app needs them.",
      },
      {
        title: "Are feature flags wildcard matched?",
        body:
          "No. Feature flag checks are exact-match only.",
      },
    ],
  },
  {
    slug: "known-limitations",
    title: "Known Limitations",
    description:
      "Accessly V1 keeps the frontend API small and predictable. These limits are intentional release boundaries.",
    sections: [
      {
        title: "Frontend Boundary",
        body:
          "Accessly controls frontend rendering only and does not replace backend authorization.",
      },
      {
        title: "Matching Scope",
        body:
          "Wildcards are segment-based and optional. Feature flags are exact-match only. Navigation items support one permission string per item.",
      },
      {
        title: "Provider Scope",
        body:
          "PermissionProvider stores the current access model in React Context. It is not a user database and should not receive every user.",
      },
      {
        title: "Adapters",
        body:
          "Adapter output is trusted by Accessly. Validate backend data before returning an AccessModel in production.",
      },
    ],
  },
];

export const docsPageSlugs = docsPages.map((page) => page.slug);

export function getDocsPage(slug: string): DocsPage | undefined {
  return docsPages.find((page) => page.slug === slug);
}

export function getDocsPageNeighbors(slug: string) {
  const index = docsPages.findIndex((page) => page.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: docsPages[index - 1] ?? null,
    next: docsPages[index + 1] ?? null,
  };
}
