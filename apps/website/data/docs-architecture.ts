import type { NavGroup } from "@/types/navigation";

export const docsSidebarGroups: NavGroup[] = [
  {
    title: "Start",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/docs/core-concepts", label: "Core Concepts" },
      { href: "/docs/react-apis", label: "React APIs" },
      { href: "/docs/backend-adapters", label: "Backend Adapters" },
      { href: "/docs/navigation", label: "Navigation" },
      { href: "/docs/debugging", label: "Debugging" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/docs/use-cases", label: "Use Cases" },
      { href: "/docs/ai", label: "AI Prompts" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs/api-reference", label: "API Reference" },
      { href: "/docs/faq", label: "FAQ" },
      { href: "/docs/known-limitations", label: "Known Limitations" },
    ],
  },
];

export const docsRouteUrls = [
  ["/docs", "Documentation home"],
  ["/docs/getting-started", "Getting Started"],
  ["/docs/installation", "Installation"],
  ["/docs/quick-start", "Quick Start"],
  ["/docs/core-concepts", "Core Concepts"],
  ["/docs/react-apis", "React APIs"],
  ["/docs/backend-adapters", "Backend Adapters"],
  ["/docs/navigation", "Navigation"],
  ["/docs/debugging", "Debugging"],
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
