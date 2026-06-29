import type React from "react";
import { describe, expect, it } from "vitest";
import {
  Can,
  Cannot,
  PermissionProvider,
  ProtectedRoute,
  checkPermission,
  createAccessChecker,
  createAdapter,
  filterNavigation,
  formatDecision,
  inspectAccess,
  isAccessModel,
  matchPermission,
  useAccessDecision,
  useAccessModel,
  usePermission,
} from "accessly";
import type {
  AccessAdapter,
  AccessDecision,
  AccessModel,
  NavigationItem,
  PermissionCheckInput,
  PermissionProviderProps,
  RolePermissions,
} from "accessly";

const model: AccessModel = {
  user: { id: "user_1", roles: ["admin"] },
  permissions: ["users.create", "reports.view", "reports.export"],
  flags: ["features.beta"],
};

const rolePermissions: RolePermissions = {
  admin: ["users.*"],
};

const validPermission: PermissionCheckInput = { permission: "users.create" };
const validAny: PermissionCheckInput = {
  any: ["users.create", "users.invite"],
};
const validAll: PermissionCheckInput = {
  all: ["reports.view", "reports.export"],
};
const validFlag: PermissionCheckInput = { flag: "features.beta" };

checkPermission(model, validPermission);
checkPermission(model, validAny);
checkPermission(model, validAll);
checkPermission(model, validFlag);

// @ts-expect-error - "permissions" is not a valid PermissionCheckInput key.
checkPermission(model, { permissions: "users.create" });
// @ts-expect-error - flag checks require a string.
checkPermission(model, { flag: 123 });
// @ts-expect-error - any checks require a string array.
checkPermission(model, { any: "users.create" });

const decision: AccessDecision = checkPermission(model, validPermission, {
  rolePermissions,
});

decision.allowed;
decision.reason;
decision.matched;
decision.missing;
decision.checkedFrom;

formatDecision(decision);
inspectAccess(model);
matchPermission("users.*", "users.create");

const checker = createAccessChecker(model);
checker.can("users.create");
checker.can(validAny);
checker.decision(validFlag);

type CustomBackendResponse = {
  perms: string[];
};

const adapter = createAdapter((source: CustomBackendResponse): AccessModel => ({
  permissions: source.perms,
}));

const typedAdapter: AccessAdapter<CustomBackendResponse> = adapter;
typedAdapter.normalize({ perms: ["users.create"] });

const nav: NavigationItem[] = [
  { label: "Users", href: "/users", permission: "users.view" },
];
filterNavigation(nav, model);

const providerProps: PermissionProviderProps = {
  access: model,
  children: null,
};

const componentExamples: React.ReactNode[] = [
  <PermissionProvider {...providerProps} />,
  <Can permission="users.create" />,
  <Can permission={{ any: ["users.create", "users.invite"] }} />,
  <Cannot permission={{ flag: "features.beta" }} />,
  <ProtectedRoute permission="pages.admin" />,
];

function HookConsumer() {
  const allowed = usePermission("users.create");
  const hookDecision = useAccessDecision({ all: ["reports.view"] });
  const hookModel = useAccessModel();

  return (
    <div>
      {String(allowed)}
      {hookDecision.reason}
      {hookModel?.user?.id}
    </div>
  );
}

if (isAccessModel(model)) {
  const narrowedModel: AccessModel = model;
  narrowedModel.permissions;
}

void componentExamples;
void HookConsumer;

describe("public type smoke", () => {
  it("keeps root imports usable at runtime", () => {
    expect(typeof checkPermission).toBe("function");
    expect(typeof createAccessChecker).toBe("function");
    expect(typeof createAdapter).toBe("function");
    expect(typeof filterNavigation).toBe("function");
  });
});
