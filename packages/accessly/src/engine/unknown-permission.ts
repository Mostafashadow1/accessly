/**
 * Determine whether a target permission is "unknown" (not recognised by
 * the system). Without a registry we conservatively treat every missing
 * permission as potentially unknown.
 */
export function isUnknownPermission(
  target: string,
  registry?: readonly string[],
): boolean {
  return registry ? !registry.includes(target) : true;
}

/**
 * Handle the unknownPermission strategy for a list of targets that were
 * all denied. Returns `true` if the caller should return early with an
 * `unknown_permission` decision when the strategy is "throw".
 */
export function shouldReturnUnknownPermission(
  deniedTargets: string[],
  unknownPermission: "ignore" | "warn" | "throw" | undefined,
  registry: readonly string[] | undefined,
): boolean {
  if (unknownPermission !== "throw") return false;

  for (const target of deniedTargets) {
    if (isUnknownPermission(target, registry)) {
      return true;
    }
  }

  return false;
}
