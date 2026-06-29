import Link from "next/link";
import {
  docsDesignPrinciples,
  docsLearningFlow,
  docsPagePatterns,
  docsPageTemplate,
  docsRouteUrls,
  docsSidebarGroups,
} from "@/data/docs-architecture";
import { CodeBlock } from "@/components/ui/code-block";
import { TerminalBlock } from "@/components/ui/terminal-block";

const firstCheckCode = `import { PermissionProvider, Can } from "accessly";

export function App() {
  return (
    <PermissionProvider
      access={{ permissions: ["users.create"] }}
    >
      <Can permission="users.create">
        <CreateUserButton />
      </Can>
    </PermissionProvider>
  );
}`;

const architectureCode = `Backend response
  -> createAdapter()
  -> AccessModel
  -> PermissionProvider
  -> Permission Engine
  -> AccessDecision
  -> Can / hooks / navigation`;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
      {children}
    </div>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
        {children}
      </p>
    </header>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface/55 shadow-[0_18px_60px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

const docsSections = [
  {
    id: "what-is-accessly",
    eyebrow: "Introduction",
    title: "What is Accessly?",
    summary:
      "Accessly is a small React permission layer for rendering UI from an explainable access model.",
    points: [
      "It helps product UI ask clear permission questions.",
      "It keeps permission checks close to the components that need them.",
      "It returns decision details so denials are easier to debug.",
    ],
  },
  {
    id: "why-accessly",
    eyebrow: "Introduction",
    title: "Why Accessly?",
    summary:
      "Accessly exists to make frontend permission logic consistent, inspectable, and easier to teach.",
    points: [
      "Avoid scattering string checks across the app.",
      "Make permission behavior visible through decisions and debugging tools.",
      "Keep backend authorization separate from frontend UI gating.",
    ],
  },
  {
    id: "access-model",
    eyebrow: "Core concept",
    title: "AccessModel",
    summary:
      "AccessModel is the normalized shape Accessly reads when evaluating permissions.",
    points: [
      "It should be easy to build from your backend response.",
      "It becomes the source of truth for components, hooks, and navigation filtering.",
      "Docs should show roles, permissions, and feature flags in one compact model.",
    ],
  },
  {
    id: "permission-provider",
    eyebrow: "Core concept",
    title: "PermissionProvider",
    summary:
      "The provider is the boundary that places the current access model into React context.",
    points: [
      "Use it near the app root or inside the authenticated app shell.",
      "Keep backend loading outside the provider, then pass the normalized model in.",
      "React APIs below the provider can read permissions without prop drilling.",
    ],
  },
  {
    id: "permission-engine",
    eyebrow: "Core concept",
    title: "Permission Engine",
    summary:
      "The engine evaluates roles, permissions, and flags into one explainable result.",
    points: [
      "It should feel deterministic and easy to debug.",
      "Every check should answer both whether access is allowed and why.",
      "The docs should teach the matching order before advanced examples.",
    ],
  },
  {
    id: "access-decision",
    eyebrow: "Core concept",
    title: "AccessDecision",
    summary:
      "An AccessDecision is the result object that powers UI states and debugging.",
    points: [
      "Lead with allowed, denied, and fallback UI examples.",
      "Explain matched values and checked source without overloading the first read.",
      "Link directly to decision explanations and formatting utilities.",
    ],
  },
  {
    id: "backend-adapters",
    eyebrow: "Core concept",
    title: "Backend Adapters",
    summary:
      "Adapters let teams keep their backend shape while giving Accessly a consistent model.",
    points: [
      "Show the backend response before the normalized access model.",
      "Explain when to write an adapter versus passing an access model directly.",
      "Keep backend mapping examples task-oriented, not showcase-oriented.",
    ],
  },
  {
    id: "react-permission-provider",
    eyebrow: "React API",
    title: "PermissionProvider",
    summary:
      "The React PermissionProvider wires a current AccessModel into the component tree.",
    points: [
      "Show where it belongs in a React or Next.js app.",
      "Explain loading, empty, and authenticated states separately.",
      "Link back to the core PermissionProvider concept for the mental model.",
    ],
  },
  {
    id: "can",
    eyebrow: "React API",
    title: "Can",
    summary:
      "Can renders children when a permission, role, or feature flag is allowed.",
    points: [
      "Start with the smallest visible UI example.",
      "Show fallback usage right after the basic example.",
      "Link to useAccessDecision for custom states.",
    ],
  },
  {
    id: "cannot",
    eyebrow: "React API",
    title: "Cannot",
    summary:
      "Cannot renders inverse access states without making product code harder to read.",
    points: [
      "Use it for empty states, upgrade prompts, and restricted messaging.",
      "Warn against duplicating business logic outside Accessly.",
      "Keep examples paired with the equivalent Can fallback pattern.",
    ],
  },
  {
    id: "protected-route",
    eyebrow: "React API",
    title: "ProtectedRoute",
    summary:
      "ProtectedRoute gates route-level UI while keeping the decision model inspectable.",
    points: [
      "Explain route protection as UI gating, not backend security.",
      "Show fallback and redirect patterns separately.",
      "Link back to PermissionProvider setup.",
    ],
  },
  {
    id: "use-permission",
    eyebrow: "React hook",
    title: "usePermission",
    summary:
      "usePermission gives custom components a small boolean permission check.",
    points: [
      "Use it when Can is not expressive enough for a component.",
      "Keep the basic example shorter than the decision hook page.",
      "Link to useAccessDecision for richer debugging states.",
    ],
  },
  {
    id: "use-access-decision",
    eyebrow: "React hook",
    title: "useAccessDecision",
    summary:
      "useAccessDecision returns the full explainable decision for a single check.",
    points: [
      "Teach this as the debugging-first hook.",
      "Show denied UI, matched permissions, and checked source.",
      "Link to formatDecision for readable output.",
    ],
  },
  {
    id: "use-access-model",
    eyebrow: "React hook",
    title: "useAccessModel",
    summary:
      "useAccessModel exposes the current normalized model for advanced UI composition.",
    points: [
      "Reserve it for advanced components and developer tooling.",
      "Warn against scattering manual permission parsing throughout the app.",
      "Link to AccessModel and filterNavigation.",
    ],
  },
  {
    id: "create-adapter",
    eyebrow: "Backend adapter",
    title: "createAdapter",
    summary:
      "createAdapter normalizes backend-specific permission payloads into an AccessModel.",
    points: [
      "Show input and output side by side.",
      "Make validation and missing fields explicit.",
      "Link to the Lab for testing real JSON responses.",
    ],
  },
  {
    id: "built-in-adapters",
    eyebrow: "Backend adapter",
    title: "Built-in adapters",
    summary:
      "Built-in adapters should cover common backend response shapes without hiding the model.",
    points: [
      "Document supported shapes as comparisons.",
      "Show when a custom adapter is clearer.",
      "Keep adapter naming stable for search.",
    ],
  },
  {
    id: "adapter-patterns",
    eyebrow: "Backend adapter",
    title: "Adapter patterns",
    summary:
      "Adapter patterns are small task guides for common backend integration problems.",
    points: [
      "Keep patterns inside docs, not as marketing showcases.",
      "Each pattern should solve one backend mapping problem.",
      "Always end with the normalized AccessModel.",
    ],
  },
  {
    id: "filter-navigation",
    eyebrow: "Navigation",
    title: "filterNavigation",
    summary:
      "filterNavigation turns the same access model into permission-aware navigation.",
    points: [
      "Show before and after navigation arrays.",
      "Explain that hidden navigation is a UX behavior, not a security boundary.",
      "Link to AccessDecision for inspectable denials.",
    ],
  },
  {
    id: "decision-explanations",
    eyebrow: "Debugging",
    title: "Decision explanations",
    summary:
      "Decision explanations help developers understand why a permission passed or failed.",
    points: [
      "Use small annotated examples instead of long prose.",
      "Explain matched values, missing values, and checked sources.",
      "Link every debugging concept back to the Lab.",
    ],
  },
  {
    id: "format-decision",
    eyebrow: "Debugging",
    title: "formatDecision",
    summary:
      "formatDecision turns a raw decision object into a readable developer message.",
    points: [
      "Show console, UI, and test output use cases.",
      "Keep formatting separate from access evaluation.",
      "Link to inspectAccess for deeper debugging.",
    ],
  },
  {
    id: "inspect-access",
    eyebrow: "Debugging",
    title: "inspectAccess",
    summary:
      "inspectAccess should help developers inspect a model before debugging individual checks.",
    points: [
      "Teach it as a model-level debugging utility.",
      "Show invalid, empty, and partially matched model states.",
      "Link to backend adapters when model shape is the problem.",
    ],
  },
  {
    id: "api-reference",
    eyebrow: "Reference",
    title: "API Reference",
    summary:
      "The API Reference should be the fastest way to find exact names, signatures, and related pages.",
    points: [
      "Group APIs by component, hook, utility, adapter, and type.",
      "Keep reference entries scannable and link back to learning pages.",
      "Use badges and stable titles so search results are predictable.",
    ],
  },
  {
    id: "faq",
    eyebrow: "Reference",
    title: "FAQ",
    summary:
      "The FAQ should answer practical Accessly questions without becoming the primary docs.",
    points: [
      "Keep answers short and link to the canonical page.",
      "Prioritize installation, SSR, backend shape, and debugging questions.",
      "Avoid using FAQ as a dumping ground for missing guides.",
    ],
  },
  {
    id: "known-limitations",
    eyebrow: "Reference",
    title: "Known Limitations",
    summary:
      "Known limitations should be direct, specific, and paired with recommended approaches.",
    points: [
      "Separate product limitations from security guidance.",
      "Explain client-side gating clearly.",
      "Keep this page easy to find from API and debugging pages.",
    ],
  },
] as const;

function DocsSectionCard({
  id,
  eyebrow,
  title,
  summary,
  points,
}: {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  points: readonly string[];
}) {
  return (
    <section id={id} className="mb-8 scroll-mt-28">
      <Panel className="p-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
          {summary}
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {points.map((point) => (
            <div
              key={point}
              className="rounded-xl border border-border bg-background/45 p-4 text-sm leading-6 text-muted"
            >
              {point}
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

export default function DocsOverview() {
  return (
    <article className="mx-auto grid w-full max-w-7xl gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0">
        <header className="mb-16 border-b border-border pb-10">
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            Documentation system
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            A learning path for explainable permissions.
          </h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-8 text-muted">
            The Accessly docs should help a React developer understand the
            model, install the package, build the first permission check, and
            find any API without digging through generated reference pages.
          </p>
        </header>

        <section className="mb-16 grid gap-4 md:grid-cols-4">
          {[
            ["5 min", "Understand the product"],
            ["1 command", "Install from npm"],
            ["1 check", "Render gated UI"],
            ["Seconds", "Find any API"],
          ].map(([value, label]) => (
            <Panel key={label} className="p-5">
              <div className="text-2xl font-semibold text-foreground">
                {value}
              </div>
              <div className="mt-2 text-sm leading-6 text-muted">{label}</div>
            </Panel>
          ))}
        </section>

        <section className="mb-20 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel className="p-6">
            <SectionHeader
              id="installation"
              eyebrow="Start"
              title="Install first"
            >
              Installation stays short and direct. The default package manager
              is npm, with other package managers available as secondary tabs
              in implementation pages.
            </SectionHeader>
            <div className="mt-6">
              <TerminalBlock commands={["npm install accessly"]} title="npm" />
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeader
              id="quick-start"
              eyebrow="First success"
              title="Build one permission check"
            >
              Quick Start should get to visible behavior quickly: provide an
              access model, render with <code>Can</code>, then explain the
              decision model only after the user has seen it work.
            </SectionHeader>
            <div className="mt-6">
              <CodeBlock title="App.tsx" code={firstCheckCode} />
            </div>
          </Panel>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="docs-architecture"
            eyebrow="Architecture"
            title="Complete documentation architecture"
          >
            The structure separates learning, workflow, debugging, and
            reference material. That keeps beginner pages calm while still
            making each API searchable and directly addressable.
          </SectionHeader>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {docsSidebarGroups.map((group) => (
              <Panel key={group.title} className="p-5">
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <span className="rounded-md border border-border bg-surface-2/70 px-2 py-1 text-[11px] text-muted-dark">
                    {group.links.length} pages
                  </span>
                </div>
                <div className="space-y-3">
                  {group.links.map((link) => {
                    return (
                      <div key={link.href} className="flex items-center gap-3">
                        <div className="h-px w-5 bg-border" />
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                          {link.label}
                        </h3>
                        {link.badge ? (
                          <span className="ml-auto rounded-md border border-border bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-dark">
                            {link.badge}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <div className="mb-20">
          {docsSections.map((section) => (
            <DocsSectionCard key={section.id} {...section} />
          ))}
        </div>

        <section className="mb-20">
          <SectionHeader
            id="learning-flow"
            eyebrow="Flow"
            title="Navigation flow"
          >
            The main path is intentionally linear. It gives new readers a fast
            mental model before sending them into individual React APIs or
            backend adapter details.
          </SectionHeader>

          <Panel className="mt-8 overflow-hidden">
            <div className="grid divide-y divide-border md:grid-cols-5 md:divide-x md:divide-y-0">
              {docsLearningFlow.map((item, index) => (
                <div key={item} className="p-4">
                  <div className="mb-2 text-[11px] font-semibold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium leading-6 text-foreground">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="architecture-pipeline"
            eyebrow="Mental model"
            title="Core architecture"
          >
            Diagrams should show how backend data becomes a decision. Each core
            concept page should teach one stage of this pipeline.
          </SectionHeader>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel className="p-6">
              <CodeBlock
                title="accessly-pipeline.txt"
                language="text"
                code={architectureCode}
              />
            </Panel>
            <Panel className="p-6">
              <div className="space-y-4">
                {[
                  ["AccessModel", "The normalized shape Accessly evaluates."],
                  [
                    "Permission Engine",
                    "The matching layer that evaluates roles, flags, and permissions.",
                  ],
                  [
                    "AccessDecision",
                    "The explainable result used by UI, hooks, and debugging tools.",
                  ],
                  [
                    "Backend Adapters",
                    "The boundary that lets each app keep its own backend shape.",
                  ],
                ].map(([name, description]) => (
                  <div
                    key={name}
                    className="rounded-xl border border-border bg-background/45 p-4"
                  >
                    <div className="text-sm font-semibold text-foreground">
                      {name}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="page-template"
            eyebrow="Template"
            title="Every docs page follows one shape"
          >
            The template should make pages predictable without forcing every
            page to become long. Short reference pages can compress sections;
            learning pages can expand them.
          </SectionHeader>

          <Panel className="mt-8 p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {docsPageTemplate.map((item, index) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-background/45 p-4"
                >
                  <div className="mb-2 text-[11px] font-semibold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium leading-6 text-foreground">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="page-patterns"
            eyebrow="Patterns"
            title="Page types"
          >
            Accessly needs three repeatable page patterns: concept pages for
            mental models, API pages for exact usage, and workflow pages for
            task completion.
          </SectionHeader>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {docsPagePatterns.map((pattern) => (
              <Panel key={pattern.title} className="p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  {pattern.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {pattern.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {pattern.examples.map((example) => (
                    <span
                      key={example}
                      className="rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] text-muted"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="url-structure"
            eyebrow="Search"
            title="URL structure"
          >
            Search depends on stable titles and predictable paths. These URLs
            are the current documentation routes for the release-ready docs set.
          </SectionHeader>

          <Panel className="mt-8 overflow-hidden">
            <div className="grid divide-y divide-border">
              {docsRouteUrls.map(([href, label]) => (
                <div
                  key={href}
                  className="grid gap-2 px-5 py-3 text-sm md:grid-cols-[minmax(210px,0.7fr)_1fr]"
                >
                  <code className="w-fit rounded-md border border-border bg-background/70 px-2 py-1 text-[12px] text-accent">
                    {href}
                  </code>
                  <span className="text-muted">{label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mb-20">
          <SectionHeader
            id="design-recommendations"
            eyebrow="Design"
            title="Documentation UI recommendations"
          >
            The docs should feel like a premium developer product: quiet,
            readable, precise, and fast to scan.
          </SectionHeader>

          <Panel className="mt-8 p-6">
            <div className="grid gap-3">
              {docsDesignPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="rounded-xl border border-border bg-background/45 p-4 text-sm leading-6 text-muted"
                >
                  {principle}
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section id="next" className="mb-6 scroll-mt-28">
          <Panel className="overflow-hidden">
            <div className="grid gap-px bg-border md:grid-cols-2">
              <Link
                href="/lab"
                className="bg-primary/10 p-6 no-underline transition hover:bg-primary/15"
              >
                <div className="text-sm font-semibold text-foreground">
                  Open Lab
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Use the Lab as the interactive companion for decisions,
                  adapters, and debugging pages.
                </p>
              </Link>
              <Link
                href="/"
                className="bg-surface p-6 no-underline transition hover:bg-surface-hover"
              >
                <div className="text-sm font-semibold text-foreground">
                  Back Home
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Return to the product overview and main Accessly workflow.
                </p>
              </Link>
            </div>
          </Panel>
        </section>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-2 border-l border-border pl-5 text-sm">
          {[
            ["Architecture", "#what-is-accessly"],
            ["Flow", "#why-accessly"],
            ["Template", "#page-template"],
            ["URLs", "#api-reference"],
            ["Design", "#design-recommendations"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="block rounded-md px-2 py-1.5 text-muted no-underline transition hover:bg-surface-hover hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </aside>
    </article>
  );
}
