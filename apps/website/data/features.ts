import type { FeatureCard, StatItem, ExplainItem, PipelineStep, DiagItem } from "@/types/website";

export const features: FeatureCard[] = [
  { label: "Any Backend", icon: "🔌", desc: "Normalize any API shape" },
  { label: "Explain Engine", icon: "🔍", desc: "Full decision diagnostics" },
  { label: "Type Safe", icon: "🛡️", desc: "End-to-end TypeScript" },
  { label: "Tree-shakeable", icon: "⚡", desc: "~5kB gzip, zero deps" },
  { label: "SSR Ready", icon: "⚛️", desc: "Next.js & RSC compatible" },
];

export const pipelineSteps: PipelineStep[] = [
  {
    num: "01",
    title: "Backend Response",
    desc: "Any API shape. No constraints.",
    code: `{ "scopes": ["users.read"] }`,
    color: "#6366f1",
  },
  {
    num: "02",
    title: "Adapter",
    desc: "One function normalizes it.",
    code: `createAdapter(src => ...)`,
    color: "#818cf8",
  },
  {
    num: "03",
    title: "AccessModel",
    desc: "Unified schema. Always consistent.",
    code: `{ permissions: [...] }`,
    color: "#8b5cf6",
  },
  {
    num: "04",
    title: "Engine",
    desc: "Checks, expands roles, validates.",
    code: `engine.check("users.read")`,
    color: "#a78bfa",
  },
  {
    num: "05",
    title: "Decision",
    desc: "Rich object. Full explanation.",
    code: `{ allowed: true, reason }`,
    color: "#c4b5fd",
  },
];

export const explainItems: ExplainItem[] = [
  {
    icon: "✓",
    text: "Matched permissions with source tracking",
    color: "#10b981",
  },
  {
    icon: "!",
    text: "Missing permissions clearly identified",
    color: "#f59e0b",
  },
  { icon: "→", text: "Role expansion tracked automatically", color: "#818cf8" },
  {
    icon: "⚡",
    text: "Feature flags use the same unified API",
    color: "#a78bfa",
  },
];

export const stats: StatItem[] = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
];

export const trustItems = [
  "Open Source",
  "MIT License",
  "Zero Dependencies",
  "TypeScript Native",
];

export const diagItems: DiagItem[] = [
  {
    allowed: true,
    label: "Dashboard",
    perm: "pages.dashboard",
    desc: "Matched via direct permission",
  },
  {
    allowed: true,
    label: "Create User",
    perm: "users.create",
    desc: "Matched via direct permission",
  },
  {
    allowed: false,
    label: "System Settings",
    perm: "settings.manage",
    desc: "Missing: settings.manage",
  },
];
