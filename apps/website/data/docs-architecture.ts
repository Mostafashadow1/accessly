import type { NavGroup } from "@/types/navigation";

export const docsSidebarGroups: NavGroup[] = [
  {
    title: "Introduction",
    links: [
      { href: "/docs#what-is-accessly", label: "What is Accessly?" },
      { href: "/docs#why-accessly", label: "Why Accessly?" },
      { href: "/docs#installation", label: "Installation" },
      { href: "/docs#quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Core Concepts",
    links: [
      { href: "/docs#access-model", label: "AccessModel" },
      { href: "/docs#permission-provider", label: "PermissionProvider" },
      { href: "/docs#permission-engine", label: "Permission Engine" },
      { href: "/docs#access-decision", label: "AccessDecision" },
      { href: "/docs#backend-adapters", label: "Backend Adapters" },
    ],
  },
  {
    title: "React APIs",
    links: [
      { href: "/docs#react-permission-provider", label: "PermissionProvider" },
      { href: "/docs#can", label: "Can", badge: "component" },
      { href: "/docs#cannot", label: "Cannot", badge: "component" },
      { href: "/docs#protected-route", label: "ProtectedRoute" },
      { href: "/docs#use-permission", label: "usePermission", badge: "hook" },
      {
        href: "/docs#use-access-decision",
        label: "useAccessDecision",
        badge: "hook",
      },
      {
        href: "/docs#use-access-model",
        label: "useAccessModel",
        badge: "hook",
      },
    ],
  },
  {
    title: "Backend Adapters",
    links: [
      { href: "/docs#create-adapter", label: "createAdapter" },
      { href: "/docs#built-in-adapters", label: "Built-in adapters" },
      { href: "/docs#adapter-recipes", label: "Adapter recipes" },
    ],
  },
  {
    title: "Navigation",
    links: [{ href: "/docs#filter-navigation", label: "filterNavigation" }],
  },
  {
    title: "Debugging",
    links: [
      { href: "/docs#decision-explanations", label: "Decision explanations" },
      { href: "/docs#format-decision", label: "formatDecision" },
      { href: "/docs#inspect-access", label: "inspectAccess" },
    ],
  },
  {
    title: "Validation",
    links: [
      { href: "/docs/use-cases", label: "Use Cases" },
      { href: "/docs/ai", label: "AI Prompts" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs#api-reference", label: "API Reference" },
      { href: "/docs#faq", label: "FAQ" },
      { href: "/docs#known-limitations", label: "Known Limitations" },
    ],
  },
];

export const plannedDocUrls = [
  ["/docs", "Documentation home"],
  ["/docs/what-is-accessly", "What is Accessly?"],
  ["/docs/why-accessly", "Why Accessly?"],
  ["/docs/installation", "Installation"],
  ["/docs/quick-start", "Quick Start"],
  ["/docs/core-concepts/access-model", "AccessModel"],
  ["/docs/core-concepts/permission-provider", "PermissionProvider"],
  ["/docs/core-concepts/permission-engine", "Permission Engine"],
  ["/docs/core-concepts/access-decision", "AccessDecision"],
  ["/docs/core-concepts/backend-adapters", "Backend Adapters"],
  ["/docs/react/permission-provider", "PermissionProvider"],
  ["/docs/react/can", "Can"],
  ["/docs/react/cannot", "Cannot"],
  ["/docs/react/protected-route", "ProtectedRoute"],
  ["/docs/react/use-permission", "usePermission"],
  ["/docs/react/use-access-decision", "useAccessDecision"],
  ["/docs/react/use-access-model", "useAccessModel"],
  ["/docs/backend/create-adapter", "createAdapter"],
  ["/docs/backend/built-in-adapters", "Built-in adapters"],
  ["/docs/backend/adapter-recipes", "Adapter recipes"],
  ["/docs/navigation/filter-navigation", "filterNavigation"],
  ["/docs/debugging/decision-explanations", "Decision explanations"],
  ["/docs/debugging/format-decision", "formatDecision"],
  ["/docs/debugging/inspect-access", "inspectAccess"],
  ["/docs/use-cases", "Use Cases"],
  ["/docs/ai", "AI Prompts"],
  ["/docs/api-reference", "API Reference"],
  ["/docs/faq", "FAQ"],
  ["/docs/known-limitations", "Known Limitations"],
] as const;

export const docsPageTemplate = [
  "Title",
  "One sentence summary",
  "Why this exists",
  "Interactive example",
  "Basic example",
  "Advanced example",
  "Common mistakes",
  "Best practices",
  "Related APIs",
  "Next page",
] as const;

export const docsLearningFlow = [
  "What is Accessly?",
  "Why Accessly?",
  "Installation",
  "Quick Start",
  "AccessModel",
  "PermissionProvider",
  "Can",
  "usePermission",
  "AccessDecision",
  "Decision explanations",
] as const;

export const docsPagePatterns = [
  {
    title: "Concept pages",
    description:
      "Teach one mental model, show where it sits in the pipeline, then link to the APIs that use it.",
    examples: ["AccessModel", "Permission Engine", "AccessDecision"],
  },
  {
    title: "API pages",
    description:
      "Lead with usage, keep parameters scannable, then explain edge cases and debugging behavior.",
    examples: ["Can", "useAccessDecision", "filterNavigation"],
  },
  {
    title: "Workflow pages",
    description:
      "Guide developers through a task from setup to a working result, with Lab links where behavior is inspectable.",
    examples: ["Installation", "Quick Start", "Backend Adapters"],
  },
] as const;

export const docsDesignPrinciples = [
  "Use one calm dark reading surface with subtle dividers and generous vertical rhythm.",
  "Keep the article column narrow enough to read and the reference data wide enough to scan.",
  "Use restrained badges for component, hook, utility, adapter, and debugging APIs.",
  "Prefer short examples, callouts, diagrams, and comparison tables over long prose.",
  "Make Lab links contextual so the docs feel interactive without becoming a dashboard.",
] as const;
