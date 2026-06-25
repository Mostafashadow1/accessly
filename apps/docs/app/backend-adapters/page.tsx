"use client";

import React from "react";
import { PermissionProvider, Can } from "accessly";
import {
  createActionsAdapter,
  directPermissionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featureFlagsAdapter,
} from "accessly";

export default function BackendAdapters() {
  const actionsModel = createActionsAdapter({
    users: ["create", "delete"],
    reports: ["view"],
  });

  const pagesModel = pagesOnlyAdapter({
    pages: ["dashboard", "users", "settings"],
  });

  const nestedModel = nestedModulesAdapter({
    users: { create: true, delete: false, view: true },
  });

  const featuresModel = featureFlagsAdapter({
    features: { "new-dashboard": true, "beta-reports": false },
  });

  return (
    <div>
      <h1>Backend Adapters</h1>
      <p>
        Every backend returns access data differently. Accessly normalizes any
        backend shape into its internal model using adapters.
      </p>

      <h2>Built-in Adapters</h2>

      <h3>createActionsAdapter</h3>
      <p>Converts a resource-to-actions map into dot-notation permissions.</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`createActionsAdapter({
  users: ["create", "delete"],
  reports: ["view"],
})
// => { permissions: ["users.create", "users.delete", "reports.view"] }`}
      </pre>
      <PermissionProvider access={actionsModel}>
        <Can permission="users.create">
          <span style={{ color: "green" }}>✓ users.create mapped</span>
        </Can>
      </PermissionProvider>

      <h3>directPermissionsAdapter</h3>
      <p>For backends that return a flat list of permission strings.</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`directPermissionsAdapter({
  permissions: ["pages.dashboard"],
  roles: ["admin"],
  flags: ["beta"],
})`}
      </pre>

      <h3>pagesOnlyAdapter</h3>
      <p>For backends that only expose page-level access.</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`pagesOnlyAdapter({ pages: ["dashboard", "users"] })
// => { permissions: ["pages.dashboard", "pages.users"] }`}
      </pre>
      <PermissionProvider access={pagesModel}>
        <Can permission="pages.dashboard">
          <span style={{ color: "green" }}>✓ pages.dashboard mapped</span>
        </Can>
      </PermissionProvider>

      <h3>nestedModulesAdapter</h3>
      <p>For nested boolean permission structures.</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`nestedModulesAdapter({
  users: { create: true, delete: false, view: true },
})
// => { permissions: ["users.create", "users.view"] }`}
      </pre>
      <PermissionProvider access={nestedModel}>
        <Can permission="users.create">
          <span style={{ color: "green" }}>✓ users.create (true)</span>
        </Can>
        <Can permission="users.delete" fallback={<span style={{ color: "red" }}>✗ users.delete (false — hidden)</span>}>
          <span style={{ color: "green" }}>users.delete</span>
        </Can>
      </PermissionProvider>

      <h3>featureFlagsAdapter</h3>
      <p>For feature flag backends.</p>
      <PermissionProvider access={featuresModel}>
        <Can permission={{ flag: "features.new-dashboard" }}>
          <span style={{ color: "green" }}>
            ✓ features.new-dashboard enabled
          </span>
        </Can>
      </PermissionProvider>

      <h2>Custom Adapter</h2>
      <p>
        Use <code>createAdapter</code> to build your own normalizer for any
        backend shape.
      </p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`import { createAdapter } from "accessly";

const adapter = createAdapter((backendResponse) => ({
  user: { id: backendResponse.userId },
  permissions: backendResponse.actions.map(a => a.permission),
}));`}
      </pre>
    </div>
  );
}