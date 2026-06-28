import type { AccesslyScenario } from "@/types/scenarios";

export const accesslyScenarios: AccesslyScenario[] = [
  {
    name: "Admin Dashboard",
    summary: "A system admin can manage users, view audit logs, and see admin-only navigation.",
    roles: [
      { name: "admin", description: "Full administrative workspace access." },
      { name: "support", description: "Can view users but cannot change settings." },
    ],
    permissions: ["users.*", "users.profile.*", "audit.view", "settings.read"],
    flags: ["features.auditLog"],
    accessModel: {
      user: { id: "u_admin", roles: ["admin"] },
      permissions: ["users.*", "users.profile.*", "audit.view", "settings.read"],
      flags: ["features.auditLog"],
    },
    checks: [
      {
        label: "Create user button",
        api: "Can",
        input: { permission: "users.create" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "wildcard" },
      },
      {
        label: "Audit page flag",
        api: "useAccessDecision",
        input: { flag: "features.auditLog" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "flag" },
      },
      {
        label: "Edit user profile",
        api: "matchPermission",
        input: { permission: "users.profile.edit" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "wildcard" },
      },
      {
        label: "Billing settings",
        api: "Cannot",
        input: { permission: "billing.manage" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
    ],
    preview: [
      { label: "Users", state: "visible", note: "Matched by users.*" },
      { label: "Audit Log", state: "visible", note: "Feature flag enabled" },
      { label: "Billing", state: "hidden", note: "No billing.manage permission" },
    ],
    codeSnippet: `const access = {
  permissions: ["users.*", "users.profile.*", "audit.view", "settings.read"],
  flags: ["features.auditLog"],
};

<PermissionProvider access={access}>
  <Can permission="users.create">
    <CreateUserButton />
  </Can>
</PermissionProvider>`,
  },
  {
    name: "SaaS Dashboard",
    summary: "A workspace owner sees reports and plan controls while beta features stay gated.",
    roles: [
      { name: "owner", description: "Owns billing and workspace settings." },
      { name: "member", description: "Uses product features without billing access." },
    ],
    permissions: ["reports.view", "billing.manage", "team.invite"],
    flags: ["features.usageInsights"],
    accessModel: {
      user: { id: "u_owner", roles: ["owner"] },
      permissions: ["reports.view", "billing.manage", "team.invite"],
      flags: ["features.usageInsights"],
    },
    checks: [
      {
        label: "Reports route",
        api: "ProtectedRoute",
        input: { permission: "reports.view" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Insights beta",
        api: "Can",
        input: { flag: "features.usageInsights" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "flag" },
      },
      {
        label: "Enterprise export",
        api: "usePermission",
        input: { permission: "exports.enterprise" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
    ],
    preview: [
      { label: "Reports", state: "visible", note: "Direct permission" },
      { label: "Usage Insights", state: "visible", note: "Flag enabled" },
      { label: "Enterprise Export", state: "disabled", note: "Upsell or explain denial" },
    ],
    codeSnippet: `const canExport = usePermission("exports.enterprise");

<button disabled={!canExport}>
  Export report
</button>`,
  },
  {
    name: "CMS",
    summary: "Editors can publish content, but destructive administration remains hidden.",
    roles: [
      { name: "editor", description: "Writes and publishes content." },
      { name: "viewer", description: "Reads content without editing." },
    ],
    permissions: ["posts.read", "posts.update", "posts.publish", "media.upload"],
    flags: ["features.richEditor"],
    accessModel: {
      user: { id: "u_editor", roles: ["editor"] },
      permissions: ["posts.read", "posts.update", "posts.publish", "media.upload"],
      flags: ["features.richEditor"],
    },
    checks: [
      {
        label: "Publish action",
        api: "Can",
        input: { all: ["posts.update", "posts.publish"] },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Media tools",
        api: "Can",
        input: { any: ["media.upload", "media.manage"] },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Admin media tools",
        api: "checkPermission",
        input: { any: ["media.delete", "media.admin"] },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
      {
        label: "Publish and delete",
        api: "checkPermission",
        input: { all: ["posts.publish", "posts.delete"] },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
      {
        label: "Delete site",
        api: "Cannot",
        input: { permission: "site.delete" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
    ],
    preview: [
      { label: "Publish", state: "visible", note: "all[] requirements pass" },
      { label: "Upload Media", state: "visible", note: "any[] has a match" },
      { label: "Delete Site", state: "hidden", note: "Destructive action denied" },
    ],
    codeSnippet: `<Can permission={{ all: ["posts.update", "posts.publish"] }}>
  <PublishButton />
</Can>`,
  },
  {
    name: "GitHub Repository",
    summary: "Repository collaborators can manage issues while protected settings stay owner-only.",
    roles: [
      { name: "maintainer", description: "Manages code review and issues." },
      { name: "contributor", description: "Participates without repository settings access." },
    ],
    permissions: ["repo.read", "issues.*", "pulls.review"],
    flags: ["features.codeowners"],
    accessModel: {
      user: { id: "u_maintainer", roles: ["maintainer"] },
      permissions: ["repo.read", "issues.*", "pulls.review"],
      flags: ["features.codeowners"],
    },
    checks: [
      {
        label: "Close issue",
        api: "Can",
        input: { permission: "issues.close" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "wildcard" },
      },
      {
        label: "Review pull request",
        api: "useAccessDecision",
        input: { permission: "pulls.review" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Repository settings",
        api: "ProtectedRoute",
        input: { permission: "repo.settings.manage" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
    ],
    preview: [
      { label: "Issues", state: "visible", note: "Wildcard permission" },
      { label: "Pull requests", state: "visible", note: "Direct permission" },
      { label: "Settings", state: "hidden", note: "Owner-only permission missing" },
    ],
    codeSnippet: `const decision = useAccessDecision("repo.settings.manage");

return decision.allowed ? <Settings /> : <Denied reason={decision.reason} />;`,
  },
  {
    name: "HR System",
    summary: "Managers can approve leave and hide salary fields without full HR administration.",
    roles: [
      { name: "manager", description: "Approves requests for direct reports." },
      { name: "hr_admin", description: "Manages employee records and compensation." },
    ],
    permissions: ["employees.read", "leave.approve", "profile.update"],
    flags: ["features.selfService"],
    accessModel: {
      user: { id: "u_manager", roles: ["manager"] },
      permissions: ["employees.read", "leave.approve", "profile.update"],
      flags: ["features.selfService"],
    },
    checks: [
      {
        label: "Approve leave",
        api: "Can",
        input: { permission: "leave.approve" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Salary field",
        api: "Cannot",
        input: { permission: "salary.view" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
      {
        label: "Self-service flag",
        api: "Can",
        input: { flag: "features.selfService" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "flag" },
      },
      {
        label: "Compensation beta",
        api: "Cannot",
        input: { flag: "features.compensation" },
        expected: { allowed: false, reason: "missing_flag", checkedFrom: "flag" },
      },
    ],
    preview: [
      { label: "Leave Approval", state: "visible", note: "Manager permission" },
      { label: "Salary", state: "hidden", note: "Field-level hiding" },
      { label: "Save Profile", state: "visible", note: "Self-service enabled" },
    ],
    codeSnippet: `<Cannot permission="salary.view">
  <span className="sr-only">Salary hidden</span>
</Cannot>`,
  },
  {
    name: "E-commerce",
    summary: "Store staff can process orders and use inventory tools while refunds require extra access.",
    roles: [
      { name: "store_staff", description: "Handles daily operations." },
      { name: "finance", description: "Handles refunds and payment operations." },
    ],
    permissions: ["orders.read", "orders.fulfill", "inventory.update"],
    flags: [],
    accessModel: {
      user: { id: "u_staff", roles: ["store_staff"] },
      permissions: ["orders.read", "orders.fulfill", "inventory.update"],
      flags: [],
    },
    checks: [
      {
        label: "Fulfill order",
        api: "Can",
        input: { permission: "orders.fulfill" },
        expected: { allowed: true, reason: "allowed", checkedFrom: "direct" },
      },
      {
        label: "Refund order",
        api: "useAccessDecision",
        input: { permission: "payments.refund" },
        expected: { allowed: false, reason: "missing_permission", checkedFrom: "none" },
      },
      {
        label: "New checkout flag",
        api: "Can",
        input: { flag: "features.newCheckout" },
        expected: { allowed: false, reason: "missing_flag", checkedFrom: "flag" },
      },
    ],
    preview: [
      { label: "Fulfill", state: "visible", note: "Direct permission" },
      { label: "Refund", state: "disabled", note: "Denied explanation shown" },
      { label: "New Checkout", state: "hidden", note: "Feature flag disabled" },
    ],
    codeSnippet: `<Can
  permission="payments.refund"
  fallback={<button disabled>Refund unavailable</button>}
>
  <RefundButton />
</Can>`,
  },
];
