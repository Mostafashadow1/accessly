"use client";

import React from "react";
import { PermissionProvider, useAccessDecision, formatDecision } from "accessly";

function DecisionInspector({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <pre
      style={{
        background: "#1e293b",
        color: "#e2e8f0",
        padding: "1rem",
        borderRadius: 8,
        overflow: "auto",
      }}
    >
{`Decision for "${permission}":
${formatDecision(decision)}`}
    </pre>
  );
}

function DecisionJSON({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <pre
      style={{
        background: "#1e293b",
        color: "#e2e8f0",
        padding: "1rem",
        borderRadius: 8,
        overflow: "auto",
      }}
    >
{JSON.stringify(decision, null, 2)}
    </pre>
  );
}

export default function ExplainEngine() {
  return (
    <div>
      <h1>Explain Engine</h1>
      <p>
        Accessly returns a full decision object, not just <code>true</code> or{" "}
        <code>false</code>. Every check includes the reason, what was requested,
        what matched, and what was missing.
      </p>

      <h2>Decision Shape</h2>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`type AccessDecision = {
  allowed: boolean;
  reason: "allowed" | "missing_permission" | "missing_flag"
        | "unknown_permission" | "not_ready" | "invalid_request";
  requested?: string[];
  missing?: string[];
  matched?: string[];
  checkedFrom?: "direct" | "role" | "wildcard" | "flag" | "none";
};`}
      </pre>

      <h2>Live Inspection</h2>
      <PermissionProvider
        access={{ permissions: ["users.create", "users.*"] }}
      >
        <h3>Allowed — exact match</h3>
        <DecisionJSON permission="users.create" />

        <h3>Denied — missing permission</h3>
        <DecisionJSON permission="users.delete" />

        <h3>Decision formatted for humans</h3>
        <DecisionInspector permission="users.create" />
      </PermissionProvider>

      <h2>useAccessDecision Hook</h2>
      <p>
        Use <code>useAccessDecision</code> when you need the full decision
        object, or <code>usePermission</code> when you only need a boolean.
      </p>
      <pre
        style={{
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
{`const result = useAccessDecision("users.create");
// { allowed: true, reason: "allowed", matched: ["users.create"], ... }

const allowed = usePermission("users.create");
// true`}
      </pre>
    </div>
  );
}