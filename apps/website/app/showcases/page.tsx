"use client";

import { useState } from "react";
import {
  PermissionProvider,
  Can,
  ProtectedRoute,
  useAccessDecision,
  formatDecision,
  createActionsAdapter,
  filterNavigation,
} from "accessly";
import type { NavigationItem, AccessModel } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { JsonPanel } from "@/components/ui/json-panel";
import { DecisionCard } from "@/components/ui/decision-card";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

function ExplainBox({ permission, access }: { permission: string; access: AccessModel }) {
  return (
    <PermissionProvider access={access}>
      <ExplainInner permission={permission} />
    </PermissionProvider>
  );
}

function ExplainInner({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <CodeBlock
      title="Decision"
      code={formatDecision(decision)}
    />
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

  const sidebarModel: AccessModel = {
    permissions: ["pages.dashboard", "pages.users", "users.create"],
  };

  const filteredNav = filterNavigation(navItems, sidebarModel);

  return (
    <div className="section">
      <div className="section-container">
        <SectionHeader
          title="Interactive Showcases"
          description="Live demos of every Accessly feature — editable, clickable, inspectable."
        />

        {/* Backend Response Playground */}
        <section className="mb-16">
          <h2 className="text-[20px] font-semibold mb-4">Backend Response Playground</h2>
          <p className="text-[14px] mb-6 text-secondary">
            Paste any JSON response from your backend and see how the adapter normalizes it into permissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2 text-tertiary">
                Backend Response (JSON)
              </label>
              <textarea
                value={backendInput}
                onChange={(e) => setBackendInput(e.target.value)}
                rows={10}
                className="w-full rounded-lg border p-3 text-[13px] font-mono bg-code border-code text-code-text"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2 text-tertiary">
                Normalized Permissions
              </label>
              <JsonPanel data={parsed ? adapterModel : { error: "Invalid JSON" }} />
            </div>
          </div>
          {parsed && (
            <div className="mt-4 flex gap-4">
              <PermissionProvider access={adapterModel}>
                <span className="text-[13px] text-allowed">
                  ✓ users.create allowed
                </span>
              </PermissionProvider>
            </div>
          )}
        </section>

        {/* Sidebar Filtering */}
        <section className="mb-16">
          <h2 className="text-[20px] font-semibold mb-4">Sidebar Filtering</h2>
          <p className="text-[14px] mb-6 text-secondary">
            Navigation items are automatically filtered based on the current user&apos;s permissions.
          </p>
          <Card header="Sidebar Filtering Demo">
            <p className="text-[13px] mb-3 text-secondary">
              User permissions: pages.dashboard, pages.users, users.create
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[13px] font-semibold mb-2">All Items</h4>
                <ul className="text-[13px] text-secondary">
                  {navItems.map((item) => (
                    <li key={item.label}>{item.label}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold mb-2">Filtered Items</h4>
                <ul className="text-[13px] text-secondary">
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
          </Card>
        </section>

        {/* Route Protection */}
        <section className="mb-16">
          <h2 className="text-[20px] font-semibold mb-4">Route Protection</h2>
          <p className="text-[14px] mb-6 text-secondary">
            <code className="text-code-key inline-code">ProtectedRoute</code> shows content or a fallback based on permissions — no router dependency.
          </p>
          <PermissionProvider access={{ permissions: ["pages.admin"] }}>
            <ProtectedRoute
              permission="pages.admin"
              fallback={
                <DecisionCard status="denied" title="Access Denied" badge="403">
                  <p className="text-[13px] m-0">You don&apos;t have permission to access this page.</p>
                </DecisionCard>
              }
            >
              <DecisionCard status="allowed" title="Welcome, Admin!" badge="Allowed">
                <p className="text-[13px] m-0">You have admin access.</p>
              </DecisionCard>
            </ProtectedRoute>
          </PermissionProvider>
        </section>

        {/* Explain Inspector */}
        <section className="mb-16">
          <h2 className="text-[20px] font-semibold mb-4">Explain Inspector</h2>
          <p className="text-[14px] mb-6 text-secondary">
            Every permission check returns a detailed decision object. See exactly why access was granted or denied.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExplainBox
              permission="users.create"
              access={{ permissions: ["users.create"] } as AccessModel}
            />
            <ExplainBox
              permission="users.delete"
              access={{ permissions: ["users.create"] } as AccessModel}
            />
            <ExplainBox
              permission="users.create"
              access={{ permissions: ["users.*"] } as AccessModel}
            />
            <ExplainBox
              permission="users.create"
              access={{ isLoading: true } as AccessModel}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
