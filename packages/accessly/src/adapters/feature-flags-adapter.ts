import type { AccessModel } from "../types";

/** Adapter for feature flag backends. */
export function featureFlagsAdapter(
  source: { features?: Record<string, boolean> },
): AccessModel {
  const flags: string[] = [];
  if (source.features) {
    for (const [key, enabled] of Object.entries(source.features)) {
      if (enabled) {
        flags.push(`features.${key}`);
      }
    }
  }
  return { flags };
}
