import { BACKEND_PRESETS } from "../data/lab-examples";
import type { BackendId, LabDecision, PermissionSourceBadge } from "../types/lab";

export interface RoleExpandedPermission {
  role: string;
  permission: string;
  grantedBy: string;
}

export interface EffectivePermissions {
  raw: string[];
  roleExpanded: RoleExpandedPermission[];
  final: string[];
  flags: string[];
  roles: string[];
}

export function computeLabDecision(
  permission: string,
  payload: Record<string, unknown>,
  backendId: BackendId,
): LabDecision {
  const startTime = performance.now();
  const effectivePermissions = getEffectivePermissions(payload, backendId);
  const requestedPermission = permission.trim();

  const directMatch = effectivePermissions.raw.includes(requestedPermission);
  const rawWildcard = findWildcardMatch(effectivePermissions.raw, requestedPermission);
  const roleDirectMatch = effectivePermissions.roleExpanded.find(
    (item) => item.permission === requestedPermission,
  );
  const roleWildcard = effectivePermissions.roleExpanded.find((item) =>
    isWildcardMatch(item.permission, requestedPermission),
  );
  const wildcardMatch = rawWildcard ?? roleWildcard?.permission ?? null;
  const roleMatch = roleDirectMatch ?? roleWildcard ?? null;

  const granted = Boolean(directMatch || wildcardMatch || roleMatch);
  const source = directMatch
    ? "direct"
    : wildcardMatch
      ? "wildcard"
      : roleMatch
        ? "role_expansion"
        : "missing";

  const matched = directMatch
    ? requestedPermission
    : wildcardMatch
      ? wildcardMatch
      : roleMatch
        ? roleMatch.permission
        : "N/A";

  const timing = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    granted,
    permission: requestedPermission,
    title: getDecisionTitle(source),
    explanation: getDecisionExplanation(source),
    details: {
      requestedPermission,
      role: roleMatch?.role,
      grantedBy: roleMatch?.grantedBy,
      matchedPermission: matched,
      wildcardMatched: wildcardMatch ?? undefined,
      source:
        source === "direct"
          ? "normalized backend permissions"
          : roleMatch
            ? roleMatch.grantedBy
            : source === "wildcard"
              ? "normalized backend permissions"
              : "not found",
      notFoundInRaw: !directMatch && !rawWildcard,
      notFoundInRoleExpanded: !roleMatch,
      notMatchedByWildcard: !wildcardMatch,
    },
    effectivePermissions,
    pipelineLabel: getPipelineLabel(source),
    matched,
    source,
    direct: directMatch,
    wildcardMatch: Boolean(wildcardMatch),
    wildcards: wildcardMatch ? [wildcardMatch] : [],
    timing,
  };
}

export function getEffectivePermissions(
  payload: Record<string, unknown>,
  backendId: BackendId,
): EffectivePermissions {
  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);
  const raw = uniqueStrings(extractPermissions(payload));
  const roles = uniqueStrings(extractRoles(payload, backend));
  const roleExpanded = roles.flatMap(expandRole);
  const final = uniqueStrings([
    ...raw,
    ...roleExpanded.map((item) => item.permission),
  ]);
  const flags = uniqueStrings(extractFlags(payload));

  return { raw, roleExpanded, final, flags, roles };
}

export function getPermissionSourceBadge(
  permission: string,
  effectivePermissions: EffectivePermissions,
): PermissionSourceBadge {
  if (effectivePermissions.flags.includes(permission)) return "Flag";
  if (effectivePermissions.raw.includes(permission)) return "Raw";
  if (effectivePermissions.roleExpanded.some((item) => item.permission === permission)) {
    return "Role";
  }
  if (findWildcardMatch(effectivePermissions.final, permission)) return "Wildcard";
  return "Missing";
}

export function extractPermissions(payload: Record<string, unknown>): string[] {
  if (Array.isArray(payload.all_permissions)) return stringValues(payload.all_permissions);
  if (Array.isArray(payload.abilities)) return stringValues(payload.abilities);
  if (Array.isArray(payload.permissions)) return stringValues(payload.permissions);
  if (Array.isArray(payload.authorities)) {
    return (payload.authorities as { authority?: unknown }[])
      .map((item) => item.authority)
      .filter((value): value is string => typeof value === "string");
  }
  if (Array.isArray(payload.claims)) {
    return (payload.claims as { type?: unknown; value?: unknown }[])
      .filter((claim) => claim.type === "permission")
      .map((claim) => claim.value)
      .filter((value): value is string => typeof value === "string");
  }
  if (isRecord(payload.session)) {
    const sessionUser = payload.session.user;
    if (isRecord(sessionUser) && Array.isArray(sessionUser.scope)) {
      return stringValues(sessionUser.scope);
    }
  }
  if (isRecord(payload.user)) {
    if (Array.isArray(payload.user.abilities)) return stringValues(payload.user.abilities);
    if (Array.isArray(payload.user.permissions)) return stringValues(payload.user.permissions);
  }
  if (isRecord(payload.app_metadata) && Array.isArray(payload.app_metadata.permissions)) {
    return stringValues(payload.app_metadata.permissions);
  }

  return [];
}

export function extractRoles(
  payload: Record<string, unknown>,
  backend?: (typeof BACKEND_PRESETS)[number],
): string[] {
  if (Array.isArray(payload.roles)) return normalizeRoles(stringValues(payload.roles));
  if (Array.isArray(payload.role)) return normalizeRoles(stringValues(payload.role));
  if (typeof payload.role === "string") return normalizeRoles([payload.role]);
  if (isRecord(payload.user)) {
    if (Array.isArray(payload.user.roles)) return normalizeRoles(stringValues(payload.user.roles));
    if (typeof payload.user.role === "string") return normalizeRoles([payload.user.role]);
  }
  if (isRecord(payload.session) && Array.isArray(payload.session.roles)) {
    return normalizeRoles(stringValues(payload.session.roles));
  }
  if (isRecord(payload.user_metadata) && Array.isArray(payload.user_metadata.roles)) {
    return normalizeRoles(stringValues(payload.user_metadata.roles));
  }

  return normalizeRoles(backend?.roles ?? []);
}

function expandRole(role: string): RoleExpandedPermission[] {
  const permissions = permissionsForRole(role);
  return permissions.map((permission) => ({
    role,
    permission,
    grantedBy: `rolePermissions.${role}`,
  }));
}

function permissionsForRole(role: string): string[] {
  if (["admin", "administrator", "owner"].includes(role)) {
    return LOCAL_COMMON.slice(0, 10);
  }
  if (["editor", "developer", "manager"].includes(role)) {
    return [
      "repositories.read",
      "repositories.write",
      "posts.create",
      "posts.write",
      "users.view",
    ];
  }
  if (["viewer", "member"].includes(role)) {
    return ["repositories.read", "billing.view"];
  }
  return [];
}

function findWildcardMatch(permissions: string[], permission: string): string | null {
  return permissions.find((candidate) => isWildcardMatch(candidate, permission)) ?? null;
}

function isWildcardMatch(candidate: string, permission: string): boolean {
  if (!candidate.includes("*")) return false;
  const candidateSegments = candidate.split(".");
  const permissionSegments = permission.split(".");

  if (candidateSegments.length !== permissionSegments.length) return false;

  return candidateSegments.every(
    (segment, index) => segment === "*" || segment === permissionSegments[index],
  );
}

function extractFlags(payload: Record<string, unknown>): string[] {
  const directFlags = [
    payload.flags,
    payload.feature_flags,
    payload.features,
    isRecord(payload.app_metadata) ? payload.app_metadata.flags : undefined,
  ];

  return directFlags.flatMap((value) => {
    if (Array.isArray(value)) return stringValues(value);
    if (isRecord(value)) {
      return Object.entries(value)
        .filter(([, enabled]) => enabled === true)
        .map(([key]) => key);
    }
    return [];
  });
}

function getDecisionTitle(source: LabDecision["source"]): string {
  if (source === "direct") return "Allowed by direct permission";
  if (source === "role_expansion") return "Allowed by role expansion";
  if (source === "wildcard") return "Allowed by wildcard permission";
  return "Denied: missing permission";
}

function getDecisionExplanation(source: LabDecision["source"]): string {
  if (source === "direct") {
    return "The requested permission is present in the normalized backend permissions.";
  }
  if (source === "role_expansion") {
    return "This permission is not present in the raw backend payload. It is granted after Accessly expands the user's roles.";
  }
  if (source === "wildcard") {
    return "A wildcard permission grants the requested permission after segment-based matching.";
  }
  return "The permission is missing from raw permissions, role-expanded permissions, and wildcard matches.";
}

function getPipelineLabel(source: LabDecision["source"]): string {
  if (source === "direct") return "Decision resolved by direct permission";
  if (source === "role_expansion") return "Decision resolved by role expansion";
  if (source === "wildcard") return "Decision resolved by wildcard";
  return "Decision denied: missing permission";
}

function normalizeRoles(roles: string[]): string[] {
  return roles.map((role) => role.replace(/^ROLE_/, "").toLowerCase());
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function stringValues(values: unknown[]): string[] {
  return values.filter((value): value is string => typeof value === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const LOCAL_COMMON = [
  "repositories.read",
  "repositories.write",
  "repositories.create",
  "repositories.delete",
  "repositories.admin",
  "posts.read",
  "posts.create",
  "posts.write",
  "posts.delete",
  "posts.publish",
];
