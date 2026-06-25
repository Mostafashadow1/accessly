"use client";

import React from "react";
import { PermissionProvider, Can } from "accessly";

export default function CoreConcepts() {
  return (
    <div>
      <h1>Core Concepts</h1>

      <h2>AccessModel</h2>
      <p>The internal normalized shape used by Accessly:</p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`type AccessModel = {
  user?: {
    id?: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
  };
  permissions?: string[];
  flags?: string[];
  navigation?: NavigationItem[];
  isLoading?: boolean;
};`}
      </pre>

      <h2>Permission Names</h2>
      <p>Dot notation for all permission types:</p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "0.5rem" }}>Type</th>
            <th style={{ padding: "0.5rem" }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>Page / Route</td>
            <td style={{ padding: "0.5rem" }}>
              <code>pages.dashboard</code>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>Action / Resource</td>
            <td style={{ padding: "0.5rem" }}>
              <code>users.create</code>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>Field-Level</td>
            <td style={{ padding: "0.5rem" }}>
              <code>users.salary.view</code>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>Feature Flag</td>
            <td style={{ padding: "0.5rem" }}>
              <code>features.new-dashboard</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Provider + Check Types</h2>
      <p>
        Wrap your app in <code>PermissionProvider</code> and use{" "}
        <code>Can</code>, <code>Cannot</code>, or hooks anywhere inside.
      </p>

      <h3>Flag Check</h3>
      <PermissionProvider
        access={{ permissions: [], flags: ["features.beta"] }}
      >
        <Can permission={{ flag: "features.beta" }}>
          <span style={{ color: "green", fontWeight: "bold" }}>
            ✓ Beta feature is enabled
          </span>
        </Can>
      </PermissionProvider>

      <h3>any / all Checks</h3>
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <Can permission={{ any: ["users.create", "users.delete"] }}>
          <span style={{ color: "green" }}>
            ✓ Has at least one of the permissions
          </span>
        </Can>
      </PermissionProvider>
    </div>
  );
}