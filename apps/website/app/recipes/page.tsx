"use client";

import { CodeBlock } from "@/components/ui/code-block";
import { Card, CardGrid } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default function Recipes() {
  return (
    <div className="section">
      <div className="section-container">
        <SectionHeader
          title="Recipes"
          description="Real-world patterns for common access control scenarios."
        />

        <div className="flex flex-col gap-8">
          <Card header="RBAC with Role Permissions">
            <CodeBlock
              title="RBAC Setup"
              code={`const rolePermissions = {
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
</PermissionProvider>`}
            />
          </Card>

          <Card header="Backend Integration with Adapter">
            <CodeBlock
              title="Custom Adapter with Mapping"
              code={`import { createAdapter } from "accessly";

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

// In your app:
<PermissionProvider source={apiResponse} adapter={adapter}>
  <App />
</PermissionProvider>`}
            />
          </Card>

          <Card header="Loading State">
            <CodeBlock
              title="Loading State Pattern"
              code={`function App() {
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

// While loading, all usePermission/useAccessDecision
// calls return { allowed: false, reason: "not_ready" }`}
            />
          </Card>

          <Card header="Debug Mode">
            <CodeBlock
              title="Debug Tools"
              code={`import { inspectAccess, formatDecision }
  from "accessly";

console.log(inspectAccess(model));
// User: u1
// Roles: admin
// Permissions (3):
//   - users.create
//   - users.delete
//   - pages.dashboard

const decision =
  useAccessDecision("users.create");
console.log(formatDecision(decision));
// Allowed: true
// Reason: allowed
// Matched: users.create
// Checked from: direct`}
            />
          </Card>

          <Card header="Wildcard Permissions">
            <CodeBlock
              title="Wildcard Patterns"
              code={`// Single-level wildcard (V1)
// "users.*" matches:
//   "users.create"
//   "users.delete"
// Does NOT match:
//   "users.profile.edit"

const model = {
  permissions: ["users.*", "reports.view"]
};

// Matched via wildcard expansion
checkPermission(model, {
  permission: "users.create"
});
// { matched: ["users.*"], checkedFrom: "wildcard" }`}
            />
          </Card>

          <Card header="Feature Flag Gates">
            <CodeBlock
              title="Feature Flags"
              code={`<PermissionProvider
  access={{
    permissions: [],
    flags: ["features.new-dashboard"]
  }}
>
  <Can permission={{ flag: "features.new-dashboard" }}>
    <NewDashboard />
  </Can>

  <Cannot permission={{ flag: "features.beta-reports" }}>
    <UpgradePrompt />
  </Cannot>
</PermissionProvider>`}
            />
          </Card>

          <Card header="Filtered Navigation">
            <CodeBlock
              title="Sidebar Filtering"
              code={`import { filterNavigation } from "accessly";
import type { NavigationItem } from "accessly";

const navItems = [
  { label: "Dashboard",
    href: "/", permission: "pages.dashboard" },
  { label: "Users",
    href: "/users", permission: "pages.users",
    children: [
      { label: "Create",
        href: "/users/create",
        permission: "users.create" },
    ]},
];

const model = {
  permissions: ["pages.dashboard"]
};

// Filters recursively — parent items with no
// accessible children are also removed
const filtered = filterNavigation(navItems, model);`}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
