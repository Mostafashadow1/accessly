"use client";

import React, { useState } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  ProtectedRoute,
  usePermissionResult,
  formatDecision,
  inspectAccess,
  createActionsAdapter,
  filterNavigation,
} from "accessly";
import type { NavigationItem } from "accessly";

function ExplainBox({ permission, access }: { permission: string; access: any }) {
  return (
    <PermissionProvider access={access}>
      <ExplainInner permission={permission} />
    </PermissionProvider>
  );
}

function ExplainInner({ permission }: { permission: string }) {
  const decision = usePermissionResult(permission);
  return (
    <pre
      style={{
        background: "#1e293b",
        color: "#e2e8f0",
        padding: "0.75rem",
        borderRadius: 6,
        fontSize: "0.85rem",
        overflow: "auto",
      }}
    >
{formatDecision(decision)}
    </pre>
  );
}

export default function Showcases() {
  const [backendInput, setBackendInput] = useState(
    JSON.stringify(
      {
        user: { id: "u1", type: "MANAGER" },
        allowedActions: ["VIEW_USERS", "CREATE_USER", "VIEW_REPORTS"],
      },
      null,
      2,
    ),
  );

  const parsed = (() => {
    try {
      return JSON.parse(backendInput);
    } catch {
      return null;
    }
  })();

  const adapterModel = parsed
    ? createActionsAdapter(
        Object.fromEntries(
          Object.entries(parsed).filter(
            ([k, v]) => Array.isArray(v) && k !== "user",
          ),
        ) as Record<string, string[]>,
      )
    : { permissions: [] };

  const navItems: NavigationItem[] = [
    { label: "Dashboard", href: "/", permission: "pages.dashboard" },
    {
      label: "Users",
      href: "/users",
      permission: "pages.users",
      children: [
        { label: "Create", href: "/users/create", permission: "users.create" },
        { label: "List", href: "/users/list", permission: "users.list" },
      ],
    },
    { label: "Reports", href: "/reports", permission: "pages.reports" },
    { label: "Settings", href: "/settings", permission: "pages.settings" },
  ];

  const sidebarModel = {
    permissions: ["pages.dashboard", "pages.users", "users.create"],
  };

  const filteredNav = filterNavigation(navItems, sidebarModel);

  return (
    <div>
      <h1>Showcases</h1>

      {/* --- Backend Response Playground --- */}
      <h2>Backend Response Playground</h2>
      <p>
        Paste any JSON response from your backend and see how the adapter
        normalizes it into permissions.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <label style={{ fontWeight: "bold" }}>Backend Response (JSON):</label>
          <textarea
            value={backendInput}
            onChange={(e) => setBackendInput(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <label style={{ fontWeight: "bold" }}>Normalized Permissions:</label>
          <pre
            style={{
              background: "#1e293b",
              color: "#e2e8f0",
              padding: "0.75rem",
              borderRadius: 6,
              minHeight: 200,
              overflow: "auto",
            }}
          >
            {parsed
              ? JSON.stringify(adapterModel, null, 2)
              : "Invalid JSON"}
          </pre>
        </div>
      </div>
      {parsed && (
        <div style={{ marginTop: "1rem" }}>
          <PermissionProvider access={adapterModel}>
            <Can permission="users.create">
              <span style={{ color: "green", fontWeight: "bold" }}>
                ✓ users.create — Allowed
              </span>
            </Can>
            <br />
            <Can
              permission="users.delete"
              fallback={
                <span style={{ color: "red", fontWeight: "bold" }}>
                  ✗ users.delete — Denied
                </span>
              }
            >
              <span style={{ color: "green", fontWeight: "bold" }}>
                ✓ users.delete — Allowed
              </span>
            </Can>
          </PermissionProvider>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Sidebar Filtering --- */}
      <h2>Sidebar Filtering</h2>
      <p>
        Navigation items are automatically filtered based on the current
        user&apos;s permissions.
      </p>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "1rem",
          background: "#f9fafb",
        }}
      >
        <p>
          <strong>User permissions:</strong> pages.dashboard, pages.users,
          users.create
        </p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h4>All Items</h4>
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Filtered Items</h4>
            <ul>
              {filteredNav.map((item) => (
                <li key={item.label}>
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.label}>{child.label}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Route Protection --- */}
      <h2>Route Protection</h2>
      <p>
        <code>ProtectedRoute</code> shows content or a fallback based on
        permissions — no router dependency.
      </p>
      <PermissionProvider access={{ permissions: ["pages.admin"] }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            background: "#f9fafb",
          }}
        >
          <ProtectedRoute
            permission="pages.admin"
            fallback={<div style={{ color: "red" }}>🚫 Access Denied</div>}
          >
            <div style={{ color: "green" }}>✅ Welcome, Admin!</div>
          </ProtectedRoute>
        </div>
      </PermissionProvider>

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Feature Flags --- */}
      <h2>Feature Flags</h2>
      <PermissionProvider
        access={{ permissions: [], flags: ["features.new-dashboard"] }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            background: "#f9fafb",
          }}
        >
          <Can permission={{ flag: "features.new-dashboard" }}>
            <div style={{ color: "green" }}>
              ✅ New Dashboard feature is active
            </div>
          </Can>
          <Cannot permission={{ flag: "features.beta-reports" }}>
            <div style={{ color: "#888" }}>
              ⏳ Beta Reports feature is not available
            </div>
          </Cannot>
        </div>
      </PermissionProvider>

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Explain Inspector --- */}
      <h2>Explain Inspector</h2>
      <p>
        Every permission check returns a detailed decision object. See exactly
        why access was granted or denied.
      </p>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "1rem",
          background: "#f9fafb",
        }}
      >
        <h4>Allowed: users.create</h4>
        <ExplainBox
          permission="users.create"
          access={{ permissions: ["users.create"] }}
        />
        <h4>Denied: users.delete</h4>
        <ExplainBox
          permission="users.delete"
          access={{ permissions: ["users.create"] }}
        />
        <h4>Wildcard match: users.*</h4>
        <ExplainBox
          permission="users.create"
          access={{ permissions: ["users.*"] }}
        />
        <h4>Not ready (loading)</h4>
        <ExplainBox
          permission="users.create"
          access={{ isLoading: true }}
        />
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Field Access --- */}
      <h2>Field-Level Permissions</h2>
      <PermissionProvider
        access={{ permissions: ["users.name.view", "users.salary.view"] }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            background: "#f9fafb",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Field</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>Name</td>
                <td style={{ padding: "0.5rem" }}>
                  <Can permission="users.name.view">John Doe</Can>
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>Email</td>
                <td style={{ padding: "0.5rem" }}>
                  <Can
                    permission="users.email.view"
                    fallback={<span style={{ color: "#888" }}>Hidden</span>}
                  >
                    john@example.com
                  </Can>
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>Salary</td>
                <td style={{ padding: "0.5rem" }}>
                  <Can
                    permission="users.salary.view"
                    fallback={<span style={{ color: "#888" }}>Hidden</span>}
                  >
                    $120,000
                  </Can>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PermissionProvider>
    </div>
  );
}