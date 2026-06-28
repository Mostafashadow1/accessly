import type { AccesslyScenario } from "@/types/scenarios";
import { CodeBlock } from "@/components/ui/code-block";

const stateLabel: Record<AccesslyScenario["preview"][number]["state"], string> = {
  visible: "Visible",
  hidden: "Hidden",
  disabled: "Disabled",
};

function formatInput(input: AccesslyScenario["checks"][number]["input"]) {
  if ("permission" in input) return input.permission;
  if ("flag" in input) return input.flag;
  if ("any" in input) return `any: ${input.any.join(", ")}`;
  if ("all" in input) return `all: ${input.all.join(", ")}`;
  return "unknown";
}

export function ScenarioRunner({
  scenarios,
}: {
  scenarios: AccesslyScenario[];
}) {
  return (
    <div className="grid gap-6">
      {scenarios.map((scenario) => (
        <section
          key={scenario.name}
          className="rounded-xl border border-border bg-surface/55 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {scenario.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {scenario.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {scenario.roles.map((role) => (
                <span
                  key={role.name}
                  className="rounded-md border border-border bg-background/55 px-2.5 py-1 text-xs text-muted"
                  title={role.description}
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background/45 p-4">
                <h3 className="text-sm font-semibold text-foreground">Checks</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                    <thead className="text-muted-dark">
                      <tr className="border-b border-border">
                        <th className="py-2 pr-3 font-medium">Use</th>
                        <th className="py-2 pr-3 font-medium">API</th>
                        <th className="py-2 pr-3 font-medium">Input</th>
                        <th className="py-2 pr-3 font-medium">Expected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenario.checks.map((check) => (
                        <tr key={check.label} className="border-b border-border/70 last:border-0">
                          <td className="py-2 pr-3 text-foreground">{check.label}</td>
                          <td className="py-2 pr-3 font-mono text-accent">{check.api}</td>
                          <td className="py-2 pr-3 font-mono text-muted">{formatInput(check.input)}</td>
                          <td className="py-2 pr-3 text-muted">
                            {check.expected.allowed ? "allow" : "deny"} / {check.expected.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/45 p-4">
                <h3 className="text-sm font-semibold text-foreground">Small UI preview</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {scenario.preview.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-md border border-border bg-surface/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <span className="text-[11px] text-muted-dark">{stateLabel[item.state]}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background/45 p-4">
                <h3 className="text-sm font-semibold text-foreground">Access model</h3>
                <pre className="mt-3 overflow-x-auto rounded-md bg-surface p-3 font-mono text-xs leading-5 text-muted">
                  {JSON.stringify(scenario.accessModel, null, 2)}
                </pre>
              </div>
              <CodeBlock title={`${scenario.name}.tsx`} code={scenario.codeSnippet} />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
