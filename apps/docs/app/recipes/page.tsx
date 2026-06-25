"use client";

import React from "react";

export default function Recipes() {
  return (
    <div>
      <h1>Recipes</h1>

      <h2>RBAC with Role Permissions</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`const rolePermissions = {
  admin: ["*"],
  manager: ["pages.users", "users.view", "users.create"],
  employee: ["pages.dashboard"]
};

<PermissionProvider
  access={{ user: { roles: ["manager"] }, permissions: [] }}
  rolePermissions={rolePermissions}
>
  <Can permission="users.create">
    <CreateUserButton />
  </Can>
</PermissionProvider>`}
      </pre>

      <h2>Backend Integration with Adapter</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`import { createAdapter } from "accessly";

const map = {
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
    .map((action: string) => map[action])
    .filter(Boolean),
}));

// In your app:
<PermissionProvider source={apiResponse} adapter={adapter}>
  <App />
</PermissionProvider>`}
      </pre>

      <h2>Loading State</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`function App() {
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

// While loading, all usePermission/useAccessDecision calls
// return { allowed: false, reason: "not_ready" }
`}
      </pre>

      <h2>Debug Mode</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`import { inspectAccess } from "accessly";

console.log(inspectAccess(model));
// User: u1
// Roles: admin
// Permissions (3):
//   - users.create
//   - users.delete
//   - pages.dashboard

const decision = useAccessDecision("users.create");
console.log(formatDecision(decision));
// Allowed: true
// Reason: allowed
// Matched: users.create
// Checked from: direct`}
      </pre>
    </div>
  );
}
