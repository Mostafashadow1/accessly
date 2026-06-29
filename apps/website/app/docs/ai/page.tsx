import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Use Accessly with AI | Accessly",
  description: "Ready-to-copy prompts for integrating Accessly with AI coding tools.",
};

const sharedRules = `Important rules:
- Use only public Accessly APIs. Do not invent APIs.
- Install with npm install accessly by default.
- Keep backend authorization separate from frontend UI gating.
- Use PermissionProvider, Can, Cannot, usePermission, useAccessDecision, createAdapter, and filterNavigation correctly.
- Explain assumptions before writing code.
- Produce TypeScript code.`;

const prompts = [
  {
    title: "Prompt: Basic Integration",
    code: `Help me integrate Accessly into a React app.

${sharedRules}

Create a minimal example that:
- defines an AccessModel with permissions and flags
- wraps the app in PermissionProvider
- uses Can and Cannot for visible and denied UI
- uses usePermission for a disabled button
- includes a short explanation of where backend authorization still belongs`,
  },
  {
    title: "Prompt: Next.js Client Component Integration",
    code: `Help me integrate Accessly into a Next.js app using TypeScript client components.

${sharedRules}

Create a small app-shell example that:
- marks Accessly UI files with "use client" when needed
- fetches or receives a backend access payload outside Accessly
- normalizes it into an AccessModel
- passes it to PermissionProvider
- uses ProtectedRoute for route-level UI gating
- uses Can for page actions
- avoids claiming Accessly replaces server-side authorization`,
  },
  {
    title: "Prompt: Backend Adapter",
    code: `Help me write an Accessly backend adapter for my API response.

${sharedRules}

My backend returns this shape:
<paste JSON here>

Please:
- use createAdapter
- normalize roles, permissions, flags, and navigation into an AccessModel
- keep validation simple and explicit
- show the adapter input and output types
- include one example PermissionProvider usage`,
  },
  {
    title: "Prompt: RBAC Admin Dashboard",
    code: `Help me build an RBAC admin dashboard UI with Accessly.

${sharedRules}

Use these roles and permissions:
<paste roles and permissions here>

Please:
- model the current user's AccessModel
- use Can for allowed actions
- use Cannot for denied messaging
- use useAccessDecision to explain why an admin control is denied
- use filterNavigation for sidebar items
- keep the result focused on UI gating, not backend enforcement`,
  },
  {
    title: "Prompt: Feature Flags",
    code: `Help me add feature flag UI checks with Accessly.

${sharedRules}

Please:
- represent enabled features in AccessModel.flags
- use Can with a flag check for enabled UI
- show a denied/fallback state for a disabled flag
- use useAccessDecision to display the missing_flag reason
- keep permissions and feature flags conceptually separate`,
  },
  {
    title: "Prompt: Navigation Filtering",
    code: `Help me filter application navigation with Accessly.

${sharedRules}

Please:
- define typed navigation items with permission fields
- define an AccessModel for the current user
- use filterNavigation to produce visible navigation
- show nested navigation behavior
- explain that hidden navigation is only a UX behavior and backend routes still need authorization`,
  },
  {
    title: "Prompt: Debug Denied Permission",
    code: `Help me debug a denied Accessly permission.

${sharedRules}

Here is the AccessModel:
<paste AccessModel here>

Here is the check that is denied:
<paste permission, any[], all[], or flag check here>

Please:
- use useAccessDecision or checkPermission as appropriate
- explain allowed, reason, missing, matched, and checkedFrom
- identify whether the issue is missing permission, missing flag, loading state, or unknown permission
- suggest the smallest safe fix without changing package logic`,
  },
  {
    title: "Prompt: Refactor existing role checks to Accessly",
    code: `Help me refactor existing React role checks to Accessly.

${sharedRules}

Here is the existing code:
<paste code here>

Please:
- replace scattered role or permission checks with Accessly APIs
- use PermissionProvider for the normalized AccessModel
- use Can, Cannot, usePermission, and useAccessDecision where each is most appropriate
- use createAdapter if the backend shape is not already an AccessModel
- preserve existing behavior unless you identify a real bug
- explain every assumption and produce TypeScript code`,
  },
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface/55 p-5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}

export default function AiPromptsPage() {
  return (
    <article className="mx-auto w-full max-w-5xl">
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          AI workflow
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Use Accessly with AI
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-7 text-muted">
          Copy these prompts into ChatGPT, Claude, Cursor, Codex, Gemini, or a
          similar coding assistant when you want help integrating Accessly
          without drifting away from the public API.
        </p>
      </header>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Section title="What this page is for">
          Use it to give AI tools a precise Accessly brief before they generate
          code, refactors, or debugging steps.
        </Section>
        <Section title="When to use it">
          Use these prompts when starting an integration, adapting a backend
          response, filtering navigation, or debugging a denied permission.
        </Section>
        <Section title="Important rules for AI">
          The prompts tell AI tools to use public APIs only, install from npm,
          keep backend authorization separate, state assumptions, and write
          TypeScript.
        </Section>
      </div>

      <div className="grid gap-6">
        {prompts.map((prompt) => (
          <section key={prompt.title} className="scroll-mt-28">
            <CodeBlock title={prompt.title} code={prompt.code} language="text" />
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-border bg-surface/55 p-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Related Docs
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ["/docs/installation", "Installation"],
            ["/docs/quick-start", "Quick Start"],
            ["/docs/debugging", "Debugging"],
            ["/docs/known-limitations", "Known Limitations"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-border bg-background/45 px-4 py-3 text-sm font-medium text-foreground no-underline transition hover:bg-surface-hover"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
