import type { StepDef } from "@/types/playground";

/*
   ── Pipeline steps for the playground progress bar ──
   */
export const PIPELINE_STEPS: StepDef[] = [
  {
    key: "response",
    num: "01",
    label: "Backend Response",
    accentIdle: "bg-muted-dark",
    accentActive: "bg-primary",
  },
  {
    key: "adapter",
    num: "02",
    label: "Adapter",
    accentIdle: "bg-accent-foreground/50",
    accentActive: "bg-accent-foreground",
  },
  {
    key: "model",
    num: "03",
    label: "AccessModel",
    accentIdle: "bg-success/50",
    accentActive: "bg-success",
  },
  {
    key: "decision",
    num: "04",
    label: "Decision",
    accentIdle: "bg-success/50",
    accentActive: "bg-success",
  },
  {
    key: "ui",
    num: "05",
    label: "UI Preview",
    accentIdle: "bg-primary/50",
    accentActive: "bg-primary",
  },
];
