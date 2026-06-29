import type { AccessModel } from "../types";

export function inspectAccess(model: AccessModel | null): string {
  if (!model) return "No access model available.";
  const lines: string[] = [];
  if (model.user?.id) lines.push(`User: ${model.user.id}`);
  if (model.user?.roles?.length) {
    lines.push(`Roles: ${model.user.roles.join(", ")}`);
  }
  if (model.permissions?.length) {
    lines.push(`Permissions (${model.permissions.length}):`);
    for (const p of model.permissions) {
      lines.push(`  - ${p}`);
    }
  }
  if (model.flags?.length) {
    lines.push(`Flags (${model.flags.length}):`);
    for (const f of model.flags) {
      lines.push(`  - ${f}`);
    }
  }
  if (model.isLoading) {
    lines.push("Status: loading");
  }
  return lines.join("\n");
}
