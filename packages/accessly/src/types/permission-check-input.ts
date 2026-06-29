export type PermissionCheckInput =
  | { permission: string }
  | { any: string[] }
  | { all: string[] }
  | { flag: string };
