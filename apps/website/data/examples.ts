import type { ExampleConfig } from "@/types/examples";

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — role-based access with admin / manager / viewer
   Tests: PermissionProvider, Can, Cannot, usePermission, ProtectedRoute,
          filterNavigation, role-based navigation, action buttons
   ═══════════════════════════════════════════════════════════════════════════ */

export const adminDashboardExample: ExampleConfig = {
  id: "admin-dashboard",
  title: "Admin Dashboard",
  description:
    "A full admin panel with role-based access control. Admin gets full access, manager can manage users and settings, viewer can only view.",
  icon: "🛡️",
  apisTested: [
    "PermissionProvider",
    "Can",
    "Cannot",
    "usePermission",
    "ProtectedRoute",
    "filterNavigation",
    "rolePermissions",
    "useAccessDecision",
  ],
  usePlans: false,
  defaultRoleOrPlan: "admin",
  defaultPermissions: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.delete",
    "settings.view",
    "settings.update",
  ],
  allPermissions: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.delete",
    "settings.view",
    "settings.update",
  ],
  rolesOrPlans: [
    {
      id: "admin",
      label: "Admin",
      description: "Full system access",
      permissions: [
        "dashboard.view",
        "users.view",
        "users.create",
        "users.delete",
        "settings.view",
        "settings.update",
      ],
    },
    {
      id: "manager",
      label: "Manager",
      description: "Can manage users and settings",
      permissions: [
        "dashboard.view",
        "users.view",
        "users.create",
        "settings.view",
        "settings.update",
      ],
    },
    {
      id: "viewer",
      label: "Viewer",
      description: "Read-only access",
      permissions: [
        "dashboard.view",
        "users.view",
        "settings.view",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  ProtectedRoute,
  filterNavigation,
} from "accessly";

const rolePermissions = {
  admin: ["dashboard.view", "users.view", "users.create",
          "users.delete", "settings.view", "settings.update"],
  manager: ["dashboard.view", "users.view", "users.create",
            "settings.view", "settings.update"],
  viewer: ["dashboard.view", "users.view", "settings.view"],
};

const NAV = [
  { label: "Dashboard", href: "/", permission: "dashboard.view" },
  { label: "Users", href: "/users", permission: "users.view",
    children: [
      { label: "Create User", href: "/users/create",
        permission: "users.create" },
    ],
  },
  { label: "Settings", href: "/settings", permission: "settings.view" },
];

function AdminPanel() {
  const canDelete = usePermission("users.delete");
  const visibleNav = filterNavigation(NAV, model);

  return (
    <PermissionProvider
      access={{ user: { roles: ["admin"] }, permissions: [] }}
      rolePermissions={rolePermissions}
    >
      <Can permission="dashboard.view">
        <DashboardWidget />
      </Can>

      <Can permission="users.create">
        <button>Create User</button>
      </Can>

      <Cannot permission="users.delete">
        <span className="text-muted">Delete unavailable</span>
      </Cannot>

      <ProtectedRoute permission="settings.view" fallback={<NoAccess />}>
        <SettingsPanel />
      </ProtectedRoute>
    </PermissionProvider>
  );
}`,
  codeExplanation:
    "This example uses PermissionProvider with rolePermissions to map roles to permissions. " +
    "Can/Cannot gates control UI visibility. usePermission drives button states. " +
    "ProtectedRoute guards the settings page. filterNavigation prunes the sidebar based on permissions.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   SAAS DASHBOARD — feature flags + plan-based access
   Tests: feature flags, plan-based access, billing UI, organization/team,
          Can, useAccessDecision, flag-based gating
   ═══════════════════════════════════════════════════════════════════════════ */

export const saasDashboardExample: ExampleConfig = {
  id: "saas-dashboard",
  title: "SaaS Dashboard",
  description:
    "A multi-tenant SaaS dashboard with Free, Pro, and Enterprise plans. Features are gated behind flags, billing is permission-controlled.",
  icon: "☁️",
  apisTested: [
    "PermissionProvider",
    "Can",
    "useAccessDecision",
    "featureFlagsAdapter",
    "flag-based permissions",
    "plan-based gating",
  ],
  usePlans: true,
  defaultRoleOrPlan: "pro",
  defaultPermissions: [
    "billing.view",
    "billing.update",
    "team.invite",
    "reports.view",
  ],
  defaultFlags: [
    "features.advancedReports",
    "features.teamManagement",
  ],
  allPermissions: [
    "billing.view",
    "billing.update",
    "team.invite",
    "team.remove",
    "reports.view",
    "reports.export",
  ],
  allFlags: [
    "features.advancedReports",
    "features.teamManagement",
    "features.auditLogs",
  ],
  rolesOrPlans: [
    {
      id: "free",
      label: "Free",
      description: "Basic access, limited features",
      permissions: [
        "billing.view",
        "reports.view",
      ],
      flags: [],
    },
    {
      id: "pro",
      label: "Pro",
      description: "Full features, team management",
      permissions: [
        "billing.view",
        "billing.update",
        "team.invite",
        "reports.view",
        "reports.export",
      ],
      flags: [
        "features.advancedReports",
        "features.teamManagement",
      ],
    },
    {
      id: "enterprise",
      label: "Enterprise",
      description: "Unlimited access, all features",
      permissions: [
        "billing.view",
        "billing.update",
        "team.invite",
        "team.remove",
        "reports.view",
        "reports.export",
      ],
      flags: [
        "features.advancedReports",
        "features.teamManagement",
        "features.auditLogs",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  useAccessDecision,
} from "accessly";

const PLAN_PERMISSIONS = {
  free: { permissions: ["billing.view", "reports.view"], flags: [] },
  pro:  { permissions: ["billing.view", "billing.update", "team.invite",
                        "reports.view", "reports.export"],
          flags: ["features.advancedReports", "features.teamManagement"] },
  enterprise: { permissions: ["*"], flags: ["features.advancedReports",
                  "features.teamManagement", "features.auditLogs"] },
};

function SaasApp({ plan }: { plan: "free" | "pro" | "enterprise" }) {
  const config = PLAN_PERMISSIONS[plan];

  return (
    <PermissionProvider
      access={{
        permissions: config.permissions,
        flags: config.flags,
      }}
    >
      {/* Feature flag gate */}
      <Can permission={{ flag: "features.advancedReports" }}>
        <AdvancedReportsWidget />
      </Can>

      {/* Permission gate */}
      <Can permission="team.invite">
        <button>Invite Member</button>
      </Can>

      {/* useAccessDecision for dynamic UI */}
      <ExportButton />
    </PermissionProvider>
  );
}

function ExportButton() {
  const decision = useAccessDecision("reports.export");
  return (
    <button disabled={!decision.allowed} title={decision.reason}>
      Export Reports
    </button>
  );
}`,
  codeExplanation:
    "This example tests plan-based access using PermissionProvider with direct permissions + flags. " +
    "Feature flags gate UI sections like Advanced Reports and Audit Logs. " +
    "useAccessDecision drives the Export button state with full decision metadata. " +
    "The billing section shows how to conditionally show upgrade prompts vs management UI.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   CMS — content permissions + draft/publish workflow
   Tests: content permissions, draft/publish workflow, field-level UI hiding,
          Can/Cannot fallback, usePermission for button states
   ═══════════════════════════════════════════════════════════════════════════ */

export const cmsExample: ExampleConfig = {
  id: "cms",
  title: "CMS Content Manager",
  description:
    "A content management system with draft/publish workflow. Authors can create and edit, editors can publish, admins can delete.",
  icon: "📝",
  apisTested: [
    "PermissionProvider",
    "Can",
    "Cannot",
    "usePermission",
    "fallback rendering",
    "button state gating",
    "field-level hiding",
  ],
  usePlans: false,
  defaultRoleOrPlan: "editor",
  defaultPermissions: [
    "posts.view",
    "posts.create",
    "posts.edit",
    "posts.publish",
    "media.upload",
  ],
  allPermissions: [
    "posts.view",
    "posts.create",
    "posts.edit",
    "posts.publish",
    "posts.delete",
    "media.upload",
  ],
  rolesOrPlans: [
    {
      id: "author",
      label: "Author",
      description: "Can create and edit own posts",
      permissions: [
        "posts.view",
        "posts.create",
        "posts.edit",
        "media.upload",
      ],
    },
    {
      id: "editor",
      label: "Editor",
      description: "Can publish and manage all posts",
      permissions: [
        "posts.view",
        "posts.create",
        "posts.edit",
        "posts.publish",
        "media.upload",
      ],
    },
    {
      id: "admin",
      label: "Admin",
      description: "Full content control including deletion",
      permissions: [
        "posts.view",
        "posts.create",
        "posts.edit",
        "posts.publish",
        "posts.delete",
        "media.upload",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
} from "accessly";

function PostEditor({ post, role }) {
  const canPublish = usePermission("posts.publish");

  return (
    <PermissionProvider
      access={{
        user: { roles: [role] },
        permissions: ROLE_PERMS[role],
      }}
    >
      {/* Title — always visible */}
      <h1>{post.title}</h1>

      {/* Publish button — only editors+ */}
      <Can
        permission="posts.publish"
        fallback={
          <span className="text-muted">
            Submit for Review
          </span>
        }
      >
        <button>Publish Now</button>
      </Can>

      {/* Cannot fallback for delete */}
      <Cannot permission="posts.delete">
        <span className="text-warning">
          Contact admin to delete
        </span>
      </Cannot>

      {/* usePermission drives state */}
      <button disabled={!canPublish} onClick={handlePublish}>
        {canPublish ? "Publish" : "Save as Draft"}
      </button>
    </PermissionProvider>
  );
}`,
  codeExplanation:
    "This example tests content-specific permissions in a CMS workflow. " +
    "Can gates show publish buttons only to editors+, Cannot shows fallback for delete. " +
    "usePermission drives dynamic button labels and disabled states. " +
    "Field-level hiding is demonstrated by conditionally showing the publish panel.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   GITHUB-STYLE REPOSITORY APP — nested resource permissions + team access
   Tests: nested permissions, action buttons, settings protection, danger zone,
          Can/Cannot, usePermission, useAccessDecision, ProtectedRoute
   ═══════════════════════════════════════════════════════════════════════════ */

export const githubRepoExample: ExampleConfig = {
  id: "github-app",
  title: "GitHub-style Repository",
  description:
    "A repository management interface with owner, maintainer, contributor, and viewer roles. Tests nested resource permissions, branch/pull request actions, and a danger zone for delete operations.",
  icon: "🐙",
  apisTested: [
    "PermissionProvider",
    "Can",
    "Cannot",
    "usePermission",
    "useAccessDecision",
    "ProtectedRoute",
    "fallback rendering",
    "nested permissions",
    "action button gating",
    "danger zone pattern",
  ],
  usePlans: false,
  defaultRoleOrPlan: "maintainer",
  defaultPermissions: [
    "repositories.view",
    "repositories.write",
    "branches.create",
    "branches.delete",
    "pullRequests.merge",
    "issues.manage",
  ],
  allPermissions: [
    "repositories.view",
    "repositories.create",
    "repositories.write",
    "repositories.delete",
    "repositories.settings.view",
    "repositories.settings.update",
    "branches.create",
    "branches.delete",
    "pullRequests.merge",
    "issues.manage",
  ],
  rolesOrPlans: [
    {
      id: "owner",
      label: "Owner",
      description: "Full repository control",
      permissions: [
        "repositories.view",
        "repositories.create",
        "repositories.write",
        "repositories.delete",
        "repositories.settings.view",
        "repositories.settings.update",
        "branches.create",
        "branches.delete",
        "pullRequests.merge",
        "issues.manage",
      ],
    },
    {
      id: "maintainer",
      label: "Maintainer",
      description: "Write access, branch management, settings view",
      permissions: [
        "repositories.view",
        "repositories.write",
        "repositories.settings.view",
        "branches.create",
        "branches.delete",
        "pullRequests.merge",
        "issues.manage",
      ],
    },
    {
      id: "contributor",
      label: "Contributor",
      description: "Can push code and create branches",
      permissions: [
        "repositories.view",
        "repositories.write",
        "branches.create",
        "issues.manage",
      ],
    },
    {
      id: "viewer",
      label: "Viewer",
      description: "Read-only access",
      permissions: [
        "repositories.view",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
  ProtectedRoute,
} from "accessly";

const ROLE_PERMS = {
  owner: ["repositories.*", "branches.*", "pullRequests.merge", "issues.manage"],
  maintainer: ["repositories.view", "repositories.write",
    "repositories.settings.view", "branches.create", "branches.delete",
    "pullRequests.merge", "issues.manage"],
  contributor: ["repositories.view", "repositories.write",
    "branches.create", "issues.manage"],
  viewer: ["repositories.view"],
};

function RepoPage({ role }) {
  return (
    <PermissionProvider
      access={{ user: { roles: [role] }, permissions: ROLE_PERMS[role] }}
    >
      <Can permission="repositories.write">
        <button>Push Code</button>
      </Can>

      <Can permission="branches.create">
        <button>New Branch</button>
      </Can>

      <Cannot permission="pullRequests.merge">
        <span>Merge not available</span>
      </Cannot>

      <ProtectedRoute
        permission="repositories.settings.view"
        fallback={<div>No access to settings</div>}
      >
        <SettingsPanel />
      </ProtectedRoute>

      {/* Danger Zone — only for owners */}
      <Can permission="repositories.delete">
        <DangerZone onDelete={handleDeleteRepo} />
      </Can>
    </PermissionProvider>
  );
}`,
  codeExplanation:
    "This example tests nested resource permissions in a repository context. " +
    "Can/Cannot gates control branch actions, pull request merges, and issue management. " +
    "ProtectedRoute guards the settings panel. A danger zone is gated behind the delete permission. " +
    "useAccessDecision drives button states with full decision metadata visible.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   HR SYSTEM — field-level permissions + sensitive data access
   Tests: field-level hiding, Can/Cannot fallback, usePermission for disabled
          actions, useAccessDecision for explanation, protected payroll section
   ═══════════════════════════════════════════════════════════════════════════ */

export const hrSystemExample: ExampleConfig = {
  id: "hr-system",
  title: "HR System",
  description:
    "An enterprise HR dashboard with sensitive employee data. Payroll is protected, documents are gated, and attendance reports require export permissions.",
  icon: "🏢",
  apisTested: [
    "PermissionProvider",
    "Can",
    "Cannot",
    "usePermission",
    "useAccessDecision",
    "field-level permission hiding",
    "fallback rendering",
    "action button gating",
    "protected section pattern",
  ],
  usePlans: false,
  defaultRoleOrPlan: "hrManager",
  defaultPermissions: [
    "employees.view",
    "employees.create",
    "employees.update",
    "payroll.view",
    "attendance.view",
    "documents.view",
  ],
  allPermissions: [
    "employees.view",
    "employees.create",
    "employees.update",
    "employees.delete",
    "payroll.view",
    "payroll.update",
    "attendance.view",
    "reports.export",
    "documents.view",
    "documents.upload",
  ],
  rolesOrPlans: [
    {
      id: "hrAdmin",
      label: "HR Admin",
      description: "Full HR control including payroll and documents",
      permissions: [
        "employees.view",
        "employees.create",
        "employees.update",
        "employees.delete",
        "payroll.view",
        "payroll.update",
        "attendance.view",
        "reports.export",
        "documents.view",
        "documents.upload",
      ],
    },
    {
      id: "hrManager",
      label: "HR Manager",
      description: "Manage employees, view payroll, manage documents",
      permissions: [
        "employees.view",
        "employees.create",
        "employees.update",
        "payroll.view",
        "attendance.view",
        "reports.export",
        "documents.view",
        "documents.upload",
      ],
    },
    {
      id: "payrollOfficer",
      label: "Payroll Officer",
      description: "Payroll and attendance focus",
      permissions: [
        "employees.view",
        "payroll.view",
        "payroll.update",
        "attendance.view",
        "reports.export",
      ],
    },
    {
      id: "employee",
      label: "Employee",
      description: "Basic self-service access",
      permissions: [
        "employees.view",
        "attendance.view",
        "documents.view",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
} from "accessly";

const ROLE_PERMS = {
  hrAdmin: ["employees.*", "payroll.*", "attendance.view",
            "reports.export", "documents.*"],
  hrManager: ["employees.view", "employees.create", "employees.update",
              "payroll.view", "attendance.view", "reports.export",
              "documents.view", "documents.upload"],
  payrollOfficer: ["employees.view", "payroll.view", "payroll.update",
                   "attendance.view", "reports.export"],
  employee: ["employees.view", "attendance.view", "documents.view"],
};

function EmployeeProfile({ role }) {
  const canUpdate = usePermission("employees.update");

  return (
    <PermissionProvider
      access={{ user: { roles: [role] }, permissions: ROLE_PERMS[role] }}
    >
      {/* Always visible */}
      <h1>Employee Name: Jane Doe</h1>

      {/* Field-level: salary hidden unless payroll.view */}
      <Can permission="payroll.view" fallback={
        <div className="masked">Salary: *****</div>
      }>
        <div>Salary: $85,000</div>
      </Can>

      {/* Action gated by permission */}
      <Can permission="employees.update">
        <button>Edit Profile</button>
      </Can>

      {/* Cannot fallback */}
      <Cannot permission="employees.delete">
        <span>Contact HR admin to delete</span>
      </Cannot>

      {/* useAccessDecision for document upload */}
      <UploadButton />
    </PermissionProvider>
  );
}`,
  codeExplanation:
    "This example tests field-level permission hiding where sensitive fields like salary are " +
    "masked unless payroll.view is granted. Can gates control employee management actions. " +
    "Cannot provides fallback UI for delete. useAccessDecision drives the document upload button " +
    "with decision explanation. The payroll section is a protected area with view/update granularity.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   E-COMMERCE ADMIN — operational dashboard with many action permissions
   Tests: Can/Cannot, usePermission, useAccessDecision, filterNavigation,
          action buttons, permission matrix, fallback UI, product mgmt, orders
   ═══════════════════════════════════════════════════════════════════════════ */

export const ecommerceExample: ExampleConfig = {
  id: "ecommerce",
  title: "E-commerce Admin",
  description:
    "A full e-commerce admin panel with store owner, manager, support, and inventory roles. Tests operational permissions across products, orders, coupons, and customers.",
  icon: "🛒",
  apisTested: [
    "PermissionProvider",
    "Can",
    "Cannot",
    "usePermission",
    "useAccessDecision",
    "filterNavigation",
    "fallback rendering",
    "action button gating",
    "permission matrix pattern",
  ],
  usePlans: false,
  defaultRoleOrPlan: "manager",
  defaultPermissions: [
    "products.view",
    "products.create",
    "products.update",
    "orders.view",
    "orders.refund",
    "customers.view",
    "reports.view",
  ],
  allPermissions: [
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
  rolesOrPlans: [
    {
      id: "storeOwner",
      label: "Store Owner",
      description: "Full store control",
      permissions: [
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
    },
    {
      id: "manager",
      label: "Manager",
      description: "Product and order management, reports",
      permissions: [
        "products.view",
        "products.create",
        "products.update",
        "orders.view",
        "orders.refund",
        "customers.view",
        "reports.view",
      ],
    },
    {
      id: "support",
      label: "Support",
      description: "Order and customer access",
      permissions: [
        "products.view",
        "orders.view",
        "orders.cancel",
        "customers.view",
      ],
    },
    {
      id: "inventory",
      label: "Inventory",
      description: "Product view and stock management",
      permissions: [
        "products.view",
        "products.update",
        "inventory.update",
      ],
    },
  ],
  codeSnippet: `import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
  filterNavigation,
} from "accessly";

const ROLE_PERMS = {
  storeOwner: ["products.*", "orders.*", "coupons.*",
               "inventory.update", "customers.view", "reports.view"],
  manager: ["products.view", "products.create", "products.update",
            "orders.view", "orders.refund", "customers.view", "reports.view"],
  support: ["products.view", "orders.view", "orders.cancel", "customers.view"],
  inventory: ["products.view", "products.update", "inventory.update"],
};

const NAV = [
  { label: "Products", href: "/products", permission: "products.view" },
  { label: "Orders", href: "/orders", permission: "orders.view" },
  { label: "Customers", href: "/customers", permission: "customers.view" },
  { label: "Reports", href: "/reports", permission: "reports.view" },
];

function EcommerceAdmin({ role }) {
  return (
    <PermissionProvider
      access={{ user: { roles: [role] }, permissions: ROLE_PERMS[role] }}
    >
      <Can permission="products.create">
        <button>Add Product</button>
      </Can>

      <Can permission="orders.refund" fallback={
        <span>Refund not available</span>
      }>
        <button>Refund Order</button>
      </Can>

      <Cannot permission="coupons.create">
        <span>Coupon creation restricted</span>
      </Cannot>

      <Can permission="inventory.update">
        <StockAdjuster />
      </Can>
    </PermissionProvider>
  );
}`,
  codeExplanation:
    "This example tests an operational e-commerce admin with many action permissions. " +
    "Can gates drive product creation, order management, and inventory controls. " +
    "Cannot provides fallback for coupon management. useAccessDecision drives refund and cancel " +
    "button states. filterNavigation prunes the sidebar. A permission matrix shows all roles at a glance.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY LIST — for the gallery overview
   ═══════════════════════════════════════════════════════════════════════════ */

import type { ExampleCategory } from "@/types/examples";

export const exampleCategories: ExampleCategory[] = [
  { id: "admin-dashboard", label: "Admin Dashboard", description: "RBAC with role-based access control for admin panels", icon: "🛡️" },
  { id: "saas-dashboard", label: "SaaS Dashboard", description: "Plan-based access with feature flags and billing", icon: "☁️" },
  { id: "cms", label: "CMS", description: "Content permissions with draft/publish workflow", icon: "📝" },
  { id: "crm", label: "CRM", description: "Customer data access with field-level permissions", icon: "👥" },
  { id: "ecommerce", label: "E-commerce", description: "Order management and inventory permissions", icon: "🛒" },
  { id: "hr-system", label: "HR System", description: "Sensitive employee data with hierarchical roles", icon: "🏢" },
  { id: "github-app", label: "GitHub-style Repo", description: "Repository access with org/team scoping", icon: "🐙" },
  { id: "billing-plans", label: "Billing & Plans", description: "Subscription tiers and payment permissions", icon: "💳" },
  { id: "team-management", label: "Team & Org", description: "Multi-team org structure with delegated admin", icon: "👪" },
  { id: "feature-flags", label: "Feature Flags", description: "A/B testing and gradual rollouts", icon: "🚩" },
];

export const allExamples: Record<string, ExampleConfig> = {
  "admin-dashboard": adminDashboardExample,
  "saas-dashboard": saasDashboardExample,
  "cms": cmsExample,
  "github-app": githubRepoExample,
  "hr-system": hrSystemExample,
  "ecommerce": ecommerceExample,
};
