"use client";

import { useState, useMemo } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
  filterNavigation,
} from "accessly";
import type { NavigationItem } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { ecommerceExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Roles ────────────────────────────────────────────────────────── */

const ROLES = [
  { id: "storeOwner", label: "Store Owner", color: "text-danger bg-danger/10 border-danger/20" },
  { id: "manager", label: "Manager", color: "text-warning bg-warning/10 border-warning/20" },
  { id: "support", label: "Support", color: "text-accent bg-primary/10 border-primary/20" },
  { id: "inventory", label: "Inventory", color: "text-muted bg-surface border-border" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const ROLE_PERMISSIONS: Record<RoleId, string[]> = {
  storeOwner: [
    "products.view",
    "products.create",
    "products.update",
    "products.delete",
    "orders.view",
    "orders.refund",
    "orders.cancel",
    "coupons.create",
    "coupons.delete",
    "inventory.update",
    "customers.view",
    "reports.view",
  ],
  manager: [
    "products.view",
    "products.create",
    "products.update",
    "orders.view",
    "orders.refund",
    "customers.view",
    "reports.view",
  ],
  support: [
    "products.view",
    "orders.view",
    "orders.cancel",
    "customers.view",
  ],
  inventory: [
    "products.view",
    "products.update",
    "inventory.update",
  ],
};

/* ── Navigation ───────────────────────────────────────────────────── */

const NAV_ITEMS: NavigationItem[] = [
  { label: "Products", href: "/products", permission: "products.view" },
  { label: "Orders", href: "/orders", permission: "orders.view" },
  { label: "Customers", href: "/customers", permission: "customers.view" },
  { label: "Reports", href: "/reports", permission: "reports.view" },
];

/* ── Mock data ────────────────────────────────────────────────────── */

const MOCK_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 79.99, stock: 42, status: "active" as const },
  { id: 2, name: "USB-C Hub", price: 34.99, stock: 128, status: "active" as const },
  { id: 3, name: "Mechanical Keyboard", price: 149.99, stock: 0, status: "out-of-stock" as const },
  { id: 4, name: "27\" Monitor", price: 399.99, stock: 15, status: "active" as const },
];

const MOCK_ORDERS = [
  { id: "#ORD-1001", customer: "Alice Chen", total: 79.99, status: "pending" as const, date: "2026-06-27" },
  { id: "#ORD-1002", customer: "Bob Kim", total: 184.98, status: "shipped" as const, date: "2026-06-26" },
  { id: "#ORD-1003", customer: "Carol Davis", total: 399.99, status: "pending" as const, date: "2026-06-25" },
  { id: "#ORD-1004", customer: "Diana Wang", total: 34.99, status: "delivered" as const, date: "2026-06-24" },
];

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function EcommerceExample() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("manager");
  const [activeSection, setActiveSection] = useState<"products" | "orders" | "coupons">("products");

  const rolePerms = ROLE_PERMISSIONS[selectedRole];

  const accessModel = useMemo(
    () => ({
      user: { id: "usr_ecom_demo", roles: [selectedRole] },
      permissions: rolePerms,
      isLoading: false,
    }),
    [selectedRole],
  );

  /* filterNavigation demo */
  const filteredNav = useMemo(
    () => filterNavigation(NAV_ITEMS, accessModel),
    [NAV_ITEMS, accessModel],
  );

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="ecommerce.tsx" />
      }
    >
      <PermissionProvider access={accessModel}>
        <div className="space-y-5">
          {/* Role Selector */}
          <RoleSelector roles={ROLES} selected={selectedRole} onSelect={setSelectedRole} />

          {/* Permission Summary */}
          <PermissionSummary permissions={rolePerms} />

          {/* Mini E-commerce UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">🛒 Store Admin</span>
                <RoleBadge role={selectedRole} />
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-muted">
                <span>{rolePerms.length} perms</span>
                {filteredNav.length < NAV_ITEMS.length && (
                  <span className="text-warning"> · {NAV_ITEMS.length - filteredNav.length} nav items hidden</span>
                )}
              </div>
            </div>

            {/* Section tabs + sidebar */}
            <div className="flex min-h-[320px]">
              {/* Sidebar with filterNavigation */}
              <div className="w-36 bg-[#09090c] border-r border-border p-3 shrink-0">
                <span className="text-[8px] font-bold text-muted-dark uppercase tracking-widest mb-2 block font-mono">
                  Sections
                </span>
                <nav className="space-y-0.5">
                  {filteredNav.map((item) => {
                    const sectionMap: Record<string, string> = {
                      Products: "products",
                      Orders: "orders",
                      Customers: "orders",
                      Reports: "products",
                    };
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          const section = sectionMap[item.label];
                          if (section) setActiveSection(section as any);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-100 cursor-pointer border",
                          item.label === "Products" && activeSection === "products"
                            ? "bg-primary/10 text-accent border-primary/20"
                            : item.label === "Orders" && (activeSection === "orders" || activeSection === "coupons")
                              ? "bg-primary/10 text-accent border-primary/20"
                              : "bg-transparent border-transparent text-muted hover:text-foreground hover:bg-surface-hover",
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                {activeSection === "products" && <ProductsSection role={selectedRole} />}
                {activeSection === "orders" && <OrdersSection role={selectedRole} />}
                {activeSection === "coupons" && <CouponsSection role={selectedRole} />}
              </div>
            </div>
          </div>

          {/* Permission Matrix */}
          <PermissionMatrix role={selectedRole} permissions={rolePerms} />

          {/* Decision Output */}
          <DecisionOutputs permissions={rolePerms} />
        </div>
      </PermissionProvider>
    </ExampleShell>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                     */
/* ════════════════════════════════════════════════════════════════════ */

function RoleSelector({
  roles,
  selected,
  onSelect,
}: {
  roles: readonly { id: string; label: string; color: string }[];
  selected: string;
  onSelect: (id: any) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono mr-1">
        Role:
      </span>
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer",
            selected === role.id
              ? role.color + " shadow-sm"
              : "bg-surface border-border text-muted hover:text-foreground hover:border-border-hover",
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    storeOwner: "bg-danger/10 text-danger border-danger/20",
    manager: "bg-warning/10 text-warning border-warning/20",
    support: "bg-primary/10 text-accent border-primary/20",
    inventory: "bg-surface text-muted-dark border-border",
  };
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", colors[role] || "")}>
      {role}
    </span>
  );
}

function PermissionSummary({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">🔑 Permissions</span>
        <span className="text-[9px] font-mono text-muted-dark">{permissions.length} / {config.allPermissions.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {config.allPermissions.map((perm) => {
          const has = permissions.includes(perm);
          return (
            <span
              key={perm}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all duration-150",
                has
                  ? "bg-success-bg text-success border-success/20"
                  : "bg-surface-2 text-muted-dark border-border/40",
              )}
            >
              {has ? "✓" : "○"} {perm}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Products Section ─────────────────────────────────────────────── */

function ProductsSection({ role }: { role: RoleId }) {
  const canCreate = usePermission("products.create");
  const canDelete = usePermission("products.delete");
  const canUpdateInventory = usePermission("inventory.update");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">📦 Products</span>
        <div className="flex items-center gap-2">
          {/* Inventory controls — gated */}
          <Can
            permission="inventory.update"
            fallback={<span className="text-[9px] text-muted-dark italic">🔒 Stock view only</span>}
          >
            <button className="px-2 py-1 rounded-lg text-[9px] font-semibold bg-surface border border-border text-muted hover:text-foreground cursor-pointer transition-all duration-150">
              Update Stock
            </button>
          </Can>
          <Can
            permission="products.create"
            fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
          >
            <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
              + Add Product
            </button>
          </Can>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono border-b border-border bg-surface-hover">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {MOCK_PRODUCTS.map((product) => (
              <tr key={product.id} className="hover:bg-surface-hover transition-colors duration-100">
                <td className="px-3 py-2 text-foreground font-medium">{product.name}</td>
                <td className="px-3 py-2 font-mono text-foreground">${product.price.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "font-mono",
                    product.stock === 0 ? "text-danger" : product.stock < 20 ? "text-warning" : "text-foreground",
                  )}>
                    {product.stock}
                  </span>
                  {canUpdateInventory && (
                    <button className="ml-1.5 text-[8px] text-accent bg-primary/5 px-1 rounded border border-primary/10 cursor-pointer hover:bg-primary/10">
                      edit
                    </button>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "text-[8px] font-mono px-1.5 py-0.5 rounded border",
                    product.status === "active" ? "bg-success-bg text-success border-success/20" :
                    "bg-danger-subtle text-danger border-danger/20",
                  )}>
                    {product.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Can
                      permission="products.update"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-primary/10 border border-primary/20 text-accent cursor-pointer hover:bg-primary/20 transition-all duration-150">
                        Edit
                      </button>
                    </Can>
                    <Cannot
                      permission="products.delete"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150">
                        Delete
                      </button>
                    </Cannot>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Orders Section ───────────────────────────────────────────────── */

function OrdersSection({ role }: { role: RoleId }) {
  const refundDecision = useAccessDecision("orders.refund");
  const cancelDecision = useAccessDecision("orders.cancel");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">📋 Orders</span>
        <Can
          permission="customers.view"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Customer data hidden</span>}
        >
          <span className="text-[9px] text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20 font-mono">
            Customer access: OK
          </span>
        </Can>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono border-b border-border bg-surface-hover">
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-surface-hover transition-colors duration-100">
                <td className="px-3 py-2 font-mono text-foreground">{order.id}</td>
                <td className="px-3 py-2 text-muted">{order.customer}</td>
                <td className="px-3 py-2 font-mono text-foreground">${order.total.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase",
                    order.status === "pending" ? "bg-warning-bg text-warning border-warning/20" :
                    order.status === "shipped" ? "bg-accent/10 text-accent border-accent/20" :
                    "bg-success-bg text-success border-success/20",
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    {/* Refund button — gated */}
                    <Can
                      permission="orders.refund"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-semibold border transition-all duration-150 cursor-pointer",
                          refundDecision.allowed && order.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"
                            : "bg-surface border-border text-muted-dark cursor-not-allowed",
                        )}
                        disabled={!refundDecision.allowed || order.status !== "pending"}
                      >
                        Refund
                      </button>
                    </Can>
                    {/* Cancel button — gated */}
                    <Can
                      permission="orders.cancel"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-semibold border transition-all duration-150 cursor-pointer",
                          cancelDecision.allowed
                            ? "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20"
                            : "bg-surface border-border text-muted-dark cursor-not-allowed",
                        )}
                        disabled={!cancelDecision.allowed}
                      >
                        Cancel
                      </button>
                    </Can>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decision details */}
      <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-muted">useAccessDecision("orders.refund"):</span>
          <span className={cn("font-bold", refundDecision.allowed ? "text-success" : "text-danger")}>
            {refundDecision.allowed ? "ALLOWED" : "DENIED"}
          </span>
          <span className="text-muted-dark">({refundDecision.reason})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">useAccessDecision("orders.cancel"):</span>
          <span className={cn("font-bold", cancelDecision.allowed ? "text-success" : "text-danger")}>
            {cancelDecision.allowed ? "ALLOWED" : "DENIED"}
          </span>
          <span className="text-muted-dark">({cancelDecision.reason})</span>
        </div>
      </div>
    </div>
  );
}

/* ── Coupons Section ──────────────────────────────────────────────── */

function CouponsSection({ role }: { role: RoleId }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">🏷️ Coupons</span>
        <Can
          permission="coupons.create"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Coupon creation restricted</span>}
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
            + Create Coupon
          </button>
        </Can>
      </div>

      <div className="rounded-lg border border-border bg-surface/20 p-4">
        <div className="divide-y divide-border/30">
          <CouponRow code="SUMMER20" discount="20% off" status="active" />
          <CouponRow code="WELCOME10" discount="10% off first order" status="active" />
          <CouponRow code="FLASH50" discount="50% off clearance" status="expired" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[9px] font-mono">
        <span className="text-muted">useAccessDecision("coupons.create"):</span>
        <PermissionState permission="coupons.create" />
        <span className="text-muted-dark ml-2">· useAccessDecision("coupons.delete"):</span>
        <PermissionState permission="coupons.delete" />
      </div>
    </div>
  );
}

function CouponRow({ code, discount, status }: { code: string; discount: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-xs">
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-foreground">{code}</span>
        <span className="text-muted">{discount}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-[8px] font-mono px-1.5 py-0.5 rounded border",
          status === "active" ? "bg-success-bg text-success border-success/20" : "bg-surface-2 text-muted-dark border-border/40",
        )}>
          {status}
        </span>
        <Cannot
          permission="coupons.delete"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
        >
          <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150">
            Delete
          </button>
        </Cannot>
      </div>
    </div>
  );
}

function PermissionState({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <span className={cn("font-bold", decision.allowed ? "text-success" : "text-danger")}>
      {decision.allowed ? "ALLOWED" : "DENIED"}
      <span className="text-muted-dark font-normal ml-1">({decision.reason})</span>
    </span>
  );
}

/* ── Permission Matrix ────────────────────────────────────────────── */

function PermissionMatrix({ role, permissions }: { role: RoleId; permissions: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>📊</span> Permission Matrix — All Roles
      </span>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[9px] font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-3 text-muted uppercase tracking-wider">Permission</th>
              {ROLES.map((r) => (
                <th key={r.id} className={cn("pb-2 px-2 text-center uppercase tracking-wider", r.id === role ? "text-accent" : "text-muted-dark")}>
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {config.allPermissions.map((perm) => (
              <tr key={perm} className={cn(permissions.includes(perm) ? "text-foreground" : "text-muted-dark")}>
                <td className="py-1.5 pr-3">{perm}</td>
                {ROLES.map((r) => {
                  const has = ROLE_PERMISSIONS[r.id].includes(perm);
                  return (
                    <td key={r.id} className="py-1.5 px-2 text-center">
                      <span className={has ? "text-success" : "text-danger"}>
                        {has ? "✓" : "✗"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Decision Outputs ─────────────────────────────────────────────── */

function DecisionOutputs({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>🎯</span> Decision Outputs (useAccessDecision)
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {config.allPermissions.map((perm) => {
          const has = permissions.includes(perm);
          return (
            <div
              key={perm}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono border",
                has
                  ? "bg-success-bg border-success/20 text-success"
                  : "bg-danger-subtle border-danger/20 text-danger",
              )}
            >
              <span>{has ? "✓" : "✗"}</span>
              <span className="truncate">{perm}</span>
              <span className="ml-auto text-[8px] opacity-70">
                {has ? "allowed" : "denied"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
