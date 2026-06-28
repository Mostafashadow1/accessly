export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface InstallCommandData {
  id: string;
  command: string;
  label: string;
}

export const pmConfig: Record<PackageManager, InstallCommandData> = {
  npm: { id: "npm", command: "npm install accessly", label: "npm" },
  pnpm: { id: "pnpm", command: "pnpm add accessly", label: "pnpm" },
  yarn: { id: "yarn", command: "yarn add accessly", label: "yarn" },
  bun: { id: "bun", command: "bun add accessly", label: "bun" },
};

export const pmList: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
