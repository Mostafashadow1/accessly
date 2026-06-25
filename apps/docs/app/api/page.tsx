"use client";

import React from "react";

export default function API() {
  return (
    <div>
      <h1>API Reference</h1>

      <h2>PermissionProvider</h2>
      <p>The root context provider for all Accessly features.</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`<PermissionProvider
  access={access}          // Direct AccessModel
  source={response}        // Raw backend response
  adapter={adapter}        // Normalizer function
  rolePermissions={roles}  // Role-to-permissions map
  registry={[]}            // Known permission registry
  unknownPermission="warn" // "ignore" | "warn" | "throw"
  debug                    // Enable debug mode
  loading                  // Show loading state
>
  <App />
</PermissionProvider>`}
      </pre>

      <h3>Props</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "0.5rem" }}>Prop</th>
            <th style={{ padding: "0.5rem" }}>Type</th>
            <th style={{ padding: "0.5rem" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}><code>access</code></td>
            <td style={{ padding: "0.5rem" }}><code>AccessModel</code></td>
            <td style={{ padding: "0.5rem" }}>Direct access model (takes precedence over source+adapter)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}><code>source</code></td>
            <td style={{ padding: "0.5rem" }}><code>TSource</code></td>
            <td style={{ padding: "0.5rem" }}>Raw backend response</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}><code>adapter</code></td>
            <td style={{ padding: "0.5rem" }}><code>AccessAdapter</code></td>
            <td style={{ padding: "0.5rem" }}>Normalizer for source</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}><code>loading</code></td>
            <td style={{ padding: "0.5rem" }}><code>boolean</code></td>
            <td style={{ padding: "0.5rem" }}>Show loading state</td>
          </tr>
        </tbody>
      </table>

      <h2>Can</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`<Can permission="users.create">
  <CreateButton />
</Can>

<Can permission="users.delete" fallback={<button disabled>Delete</button>}>
  <button>Delete</button>
</Can>

<Can permission="users.create">
  {(decision) => decision.allowed ? <Button /> : null}
</Can>`}
      </pre>

      <h2>Cannot</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`<Cannot permission="users.delete">
  <UpgradeMessage />
</Cannot>`}
      </pre>

      <h2>ProtectedRoute</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`<ProtectedRoute permission="pages.users" fallback={<Forbidden />}>
  <UsersPage />
</ProtectedRoute>`}
      </pre>

      <h2>Hooks</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
>
{`const allowed = usePermission("users.create");
const result = usePermissionResult("users.create");
const model = useAccess();`}
      </pre>
    </div>
  );
}