"use client";

import { PermissionProvider, Can } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";

export default function CoreConcepts() {
  return (
    <div>
      <h1 className="text-[26px] font-bold mb-2">Core Concepts</h1>
      <p className="text-[14px] mb-8 text-secondary">
        The internal normalized shape used by Accessly.
      </p>

      <h2 className="text-[18px] font-semibold mb-3">AccessModel</h2>
      <CodeBlock
        title="AccessModel type"
        code={`type AccessModel = {
  user?: {
    id?: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
  };
  permissions?: string[];
  flags?: string[];
  navigation?: NavigationItem[];
  isLoading?: boolean;
};`}
      />

      <h2 className="text-[18px] font-semibold mb-3 mt-8">Permission Names</h2>
      <div className="overflow-x-auto rounded-lg border border-surface mb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b-surface">
              <th className="text-left px-4 py-3 font-semibold text-tertiary">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-tertiary">Example</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["Page / Route", "pages.dashboard"],
              ["Action / Resource", "users.create"],
              ["Field-Level", "users.salary.view"],
              ["Feature Flag", "features.new-dashboard"],
            ] as const).map(([type, example]) => (
              <tr key={type} className="border-b-surface">
                <td className="px-4 py-3">{type}</td>
                <td className="px-4 py-3"><code className="text-code-key text-[12px]">{example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-[18px] font-semibold mb-3 mt-8">Flag Check</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CodeBlock
          title="Flag Check"
          code={`<PermissionProvider
  access={{
    permissions: [],
    flags: ["features.beta"]
  }}
>
  <Can permission={{ flag: "features.beta" }}>
    <BetaFeature />
  </Can>
</PermissionProvider>`}
        />
        <PermissionProvider access={{ permissions: [], flags: ["features.beta"] }}>
          <PlaygroundPanel header="Live">
            <Can permission={{ flag: "features.beta" }}>
              <span className="text-[13px] text-allowed">
                ✓ Beta feature is enabled
              </span>
            </Can>
          </PlaygroundPanel>
        </PermissionProvider>
      </div>

      <h2 className="text-[18px] font-semibold mb-3 mt-8">any / all Checks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CodeBlock
          title="any / all"
          code={`// any — at least one matches
<Can permission={{
  any: ["users.create", "users.delete"]
}}>
  <ActionPanel />
</Can>

// all — every permission required
<Can permission={{
  all: ["users.create", "users.delete"]
}}>
  <AdminPanel />
</Can>`}
        />
        <PermissionProvider access={{ permissions: ["users.create"] }}>
          <PlaygroundPanel header="Live">
            <Can permission={{ any: ["users.create", "users.delete"] }}>
              <span className="text-[13px] text-allowed">
                ✓ Has at least one required permission
              </span>
            </Can>
          </PlaygroundPanel>
        </PermissionProvider>
      </div>
    </div>
  );
}
