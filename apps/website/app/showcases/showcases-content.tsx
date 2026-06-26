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
import { FeaturePill } from "@/components/ui/feature-pill";
import { Badge } from "@/components/ui/badge";

function ExplainBox({ permission, access, label }: { permission: string; access: AccessModel; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border-light pb-2">
        <span className="text-xs font-semibold text-foreground font-mono">{label}</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono ${
          permission === "users.delete" || (access.isLoading)
            ? "bg-danger-bg text-danger border border-danger/20"
            : "bg-success-bg text-success border border-success/20"
        }`}>
          {permission === "users.delete" || (access.isLoading) ? "403" : "Allowed"}
        </span>
      </div>
      <PermissionProvider access={access}>
        <ExplainInner permission={permission} />
      </PermissionProvider>
    </div>
  );
}

function ExplainInner({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <CodeBlock
      title="Accessly Decision Log"
      code={formatDecision(decision)}
    />
  );
}

export function ShowcasesContent() {
  const [backendInput, setBackendInput] = useState(
    JSON.stringify(
      {
        user: { id: "usr_active_9", type: "MANAGER" },
        permissions: {
          users: ["create", "list"],
          reports: ["view"]
        }
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

  const adapterModel = (() => {
    if (!parsed) return { permissions: [] } as AccessModel;

    // Auto-normalize if nested permissions object is present
    const permissionsList: string[] = [];
    if (parsed.permissions && typeof parsed.permissions === "object") {
      Object.entries(parsed.permissions).forEach(([resource, actions]) => {
        if (Array.isArray(actions)) {
          actions.forEach(action => {
            permissionsList.push(`${resource}.${action}`);
          });
        }
      });
    }

    return {
      user: parsed.user || {},
      permissions: permissionsList,
    } as AccessModel;
  })();

  const navItems: NavigationItem[] = [
    { label: "Dashboard", href: "/", permission: "pages.dashboard" },
    {
      label: "User Management",
      href: "/users",
      permission: "pages.users",
      children: [
        { label: "Create Users", href: "/users/create", permission: "users.create" },
        { label: "Invite Members", href: "/users/invite", permission: "users.invite" },
      ],
    },
    { label: "Financial Reports", href: "/reports", permission: "pages.reports" },
    { label: "System Settings", href: "/settings", permission: "pages.settings" },
  ];

  const sidebarModel: AccessModel = {
    permissions: ["pages.dashboard", "pages.users", "users.create"],
  };

  const filteredNav = filterNavigation(navItems, sidebarModel);

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <div className="relative border-b border-border overflow-hidden py-20 md:py-28 bg-[#08080a]">
        {/* Radial Glow & Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FeaturePill label="Interactive Demos" />
          <h1 className="text-[clamp(36px,6vw,72px)] font-bold -tracking-[0.03em] leading-[1.1] text-foreground mt-4 mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Interactive Showcases
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Live demos of every Accessly capability — fully editable, clickable, and inspectable.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {/* 1. Backend Response Playground */}
        <section className="py-16 md:py-24 border-b border-border last:border-b-0">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-mono text-sm font-bold bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent">01</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-dark font-mono">Showcase 01 of 04</span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,42px)] font-bold -tracking-[0.03em] leading-[1.15] text-foreground mb-3">
              Backend Payload Normalizer
            </h2>
            <p className="text-[14px] text-muted mb-8 leading-relaxed max-w-3xl">
              Input custom JSON responses from your API server on the left and see how Accessly maps resources dynamically to a standard flat AccessModel schema.
            </p>
            <div className="rounded-2xl border border-border bg-[#101013] backdrop-blur-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
                <div className="bg-surface p-6">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-dark">
                    Backend API Response (JSON)
                  </label>
                  <textarea
                    value={backendInput}
                    onChange={(e) => setBackendInput(e.target.value)}
                    rows={9}
                    className="w-full rounded-xl border border-border bg-[#060608] p-4 text-[12px] font-mono text-foreground/80 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-y transition-all duration-200 placeholder:text-muted-dark"
                  />
                </div>
                <div className="bg-surface p-6">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-dark">
                    Normalized AccessModel
                  </label>
                  <JsonPanel data={parsed ? adapterModel : { error: "Invalid JSON syntax" }} />
                </div>
              </div>
            </div>
            {parsed && (
              <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl max-w-md mt-6">
                <span className="text-xs text-muted font-medium">Verify Can `users.create`?</span>
                <PermissionProvider access={adapterModel}>
                  <Can permission="users.create"
                    fallback={<Badge variant="denied">Denied</Badge>}>
                    <Badge variant="allowed">Allowed</Badge>
                  </Can>
                </PermissionProvider>
              </div>
            )}
          </div>
        </section>

        {/* 2. Sidebar Filtering */}
        <section className="py-16 md:py-24 border-b border-border last:border-b-0">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-mono text-sm font-bold bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent">02</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-dark font-mono">Showcase 02 of 04</span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,42px)] font-bold -tracking-[0.03em] leading-[1.15] text-foreground mb-3">
              Smart Navigation Sidebar Filter
            </h2>
            <p className="text-[14px] text-muted mb-8 leading-relaxed max-w-3xl">
              Cleanly prune menu nodes based on permissions. If all nested children within a folder are restricted, the entire parent directory is hidden.
            </p>
            <Card header="Sidebar Navigation Simulation">
              <div className="mb-6 bg-surface-2 border border-border-light rounded-lg p-3 max-w-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-dark mb-1">
                  Active User Permissions Model
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs text-accent">
                  <span>pages.dashboard</span>
                  <span className="text-muted-dark">•</span>
                  <span>pages.users</span>
                  <span className="text-muted-dark">•</span>
                  <span>users.create</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Raw Navigation Array */}
                <div className="bg-[#08080a] border border-border-light rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 border-b border-border-light pb-2">
                    Full Layout Configuration
                  </h4>
                  <ul className="text-xs text-muted space-y-3 font-mono list-none p-0 m-0">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <span className="text-foreground font-semibold">{item.label}</span>
                        <span className="text-[10px] text-muted-dark ml-2">[{item.permission}]</span>
                        {item.children && (
                          <ul className="pl-4 mt-1.5 space-y-1.5 list-none border-l border-border-light">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <span className="text-muted">{child.label}</span>
                                <span className="text-[10px] text-muted-dark ml-2">[{child.permission}]</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filtered Visual Navigation Mockup */}
                <div className="border border-border bg-[#060608] rounded-xl p-4 flex flex-col gap-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 border-b border-border-light pb-2">
                    Live Filtered Sidebar UI
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    {filteredNav.map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      return (
                        <div key={item.label} className="text-xs">
                          <div className="px-3 py-2 bg-surface border border-border-light rounded-lg text-foreground font-medium flex items-center justify-between">
                            <span>{item.label}</span>
                          </div>
                          {hasChildren && (
                            <div className="pl-3 mt-1.5 flex flex-col gap-1 border-l border-primary/20 ml-3">
                              {item.children!.map((child) => (
                                <div
                                  key={child.label}
                                  className="px-3 py-1.5 bg-surface/50 border border-border-light rounded-md text-muted hover:text-foreground text-[11px]"
                                >
                                  {child.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Hidden nodes indicator */}
                    <div className="mt-4 p-2 bg-surface-2 border border-dashed border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-dark font-medium italic">
                        Restricted items (Financial Reports, Invite Members, System Settings) were auto-filtered.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 3. Route Protection */}
        <section className="py-16 md:py-24 border-b border-border last:border-b-0">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-mono text-sm font-bold bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent">03</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-dark font-mono">Showcase 03 of 04</span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,42px)] font-bold -tracking-[0.03em] leading-[1.15] text-foreground mb-3">
              Route Protection Component
            </h2>
            <p className="text-[14px] text-muted mb-8 leading-relaxed max-w-3xl">
              Mount pages or show customizable error/unauthorized templates dynamically using the client-side <code className="text-xs font-mono">ProtectedRoute</code> wrapper.
            </p>
            <div className="rounded-2xl border border-border bg-[#101013] overflow-hidden p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-dark">
                    Case A: User has `pages.admin`
                  </label>
                  <PermissionProvider access={{ permissions: ["pages.admin"] }}>
                    <ProtectedRoute
                      permission="pages.admin"
                      fallback={
                        <DecisionCard status="denied" title="Access Denied" badge="403">
                          <p className="text-xs text-muted m-0">You don&apos;t have permissions for this admin area.</p>
                        </DecisionCard>
                      }
                    >
                      <DecisionCard status="allowed" title="Admin View Active" badge="Allowed">
                        <p className="text-xs text-muted m-0">Admin view mounted successfully.</p>
                      </DecisionCard>
                    </ProtectedRoute>
                  </PermissionProvider>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-dark">
                    Case B: User lacks `pages.admin`
                  </label>
                  <PermissionProvider access={{ permissions: ["pages.dashboard"] }}>
                    <ProtectedRoute
                      permission="pages.admin"
                      fallback={
                        <DecisionCard status="denied" title="Access Denied" badge="403">
                          <p className="text-xs text-muted m-0">You don&apos;t have permissions for this admin area.</p>
                        </DecisionCard>
                      }
                    >
                      <DecisionCard status="allowed" title="Admin View Active" badge="Allowed">
                        <p className="text-xs text-muted m-0">Admin view mounted successfully.</p>
                      </DecisionCard>
                    </ProtectedRoute>
                  </PermissionProvider>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Explain Inspector */}
        <section className="py-16 md:py-24 border-b border-border last:border-b-0">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-mono text-sm font-bold bg-gradient-to-br from-primary/20 to-violet/10 border border-primary/30 text-accent">04</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-dark font-mono">Showcase 04 of 04</span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,42px)] font-bold -tracking-[0.03em] leading-[1.15] text-foreground mb-3">
              Diagnostic Explain Inspector
            </h2>
            <p className="text-[14px] text-muted mb-8 leading-relaxed max-w-3xl">
              Query permission nodes using the console diagnostic engine to extract granular decision explanations (checkedFrom, matched patterns, failure reasons).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExplainBox
                label="Direct Match Allowed"
                permission="users.create"
                access={{ permissions: ["users.create"] } as AccessModel}
              />
              <ExplainBox
                label="Direct Match Denied"
                permission="users.delete"
                access={{ permissions: ["users.create"] } as AccessModel}
              />
              <ExplainBox
                label="Wildcard Match Allowed"
                permission="users.create"
                access={{ permissions: ["users.*"] } as AccessModel}
              />
              <ExplainBox
                label="Loading Hold (UX Block)"
                permission="users.create"
                access={{ isLoading: true } as AccessModel}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
