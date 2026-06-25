"use client";

import React from "react";
import { PermissionProvider, Can } from "accessly";

const exampleAccess = {
  permissions: ["users.create", "users.delete", "pages.dashboard"],
};

export default function Home() {
  return (
    <div>
      <h1>Accessly</h1>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Explainable access control for React and Next.js.
      </p>

      <h2>Quick Start</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`pnpm add accessly`}
      </pre>

      <h2>Usage</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
{`import { PermissionProvider, Can } from "accessly";

<PermissionProvider access={access}>
  <Can permission="users.create">
    <CreateUserButton />
  </Can>
</PermissionProvider>`}
      </pre>

      <h2>Live Example</h2>
      <PermissionProvider access={exampleAccess}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            background: "#f9fafb",
          }}
        >
          <p>
            <strong>Permissions:</strong> users.create, users.delete,
            pages.dashboard
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <Can permission="users.create">
              <button
                style={{
                  padding: "0.5rem 1rem",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Create User (allowed)
              </button>
            </Can>
            <Can
              permission="users.delete"
              fallback={
                <button
                  disabled
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#ccc",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Delete (denied)
                </button>
              }
            >
              <button
                style={{
                  padding: "0.5rem 1rem",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Delete User (allowed)
              </button>
            </Can>
            <Can permission="pages.settings">
              <button
                style={{
                  padding: "0.5rem 1rem",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Settings (denied — hidden)
              </button>
            </Can>
          </div>
        </div>
      </PermissionProvider>
    </div>
  );
}
