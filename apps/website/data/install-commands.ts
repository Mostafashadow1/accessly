export type PackageManager = "pnpm" | "npm" | "bun" | "yarn";

export interface InstallCommandData {
  id: string;
  command: string;
  label: string;
}

export const pmConfig: Record<PackageManager, InstallCommandData> = {
  pnpm: { id: "pnpm", command: "pnpm add accessly", label: "pnpm" },
  npm: { id: "npm", command: "npm install accessly", label: "npm" },
  bun: { id: "bun", command: "bun add accessly", label: "bun" },
  yarn: { id: "yarn", command: "yarn add accessly", label: "yarn" },
};

export const pmList: PackageManager[] = ["pnpm", "npm", "bun", "yarn"];
