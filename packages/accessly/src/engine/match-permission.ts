/**
 * Check if a permission matches a target using wildcard rules.
 * - `*` matches everything
 * - `users.*` matches `users.create`, `users.delete` (single-level wildcard)
 * - `users.profile.*` matches `users.profile.edit`
 */
export function matchPermission(
  permission: string,
  target: string,
): boolean {
  if (permission === "*") return true;

  const permParts = permission.split(".");
  const targetParts = target.split(".");

  if (permParts.length !== targetParts.length) {
    return false;
  }

  for (let i = 0; i < permParts.length; i++) {
    if (permParts[i] === "*") continue;
    if (permParts[i] !== targetParts[i]) return false;
  }

  return true;
}
