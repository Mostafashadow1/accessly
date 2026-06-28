"use client";

import { useState } from "react";
import { exampleCategories, allExamples } from "@/data/examples";
import { AdminDashboardExample } from "./admin-dashboard";
import { SaasDashboardExample } from "./saas-dashboard";
import { CmsExample } from "./cms";
import { GithubRepoExample } from "./github-repo";
import { HrSystemExample } from "./hr-system";
import { EcommerceExample } from "./ecommerce";
import { FeaturePill } from "@/components/ui/feature-pill";
import { Badge } from "@/components/ui/badge";
import type { ExampleCategoryId } from "@/types/examples";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const EXAMPLE_COMPONENTS: Record<ExampleCategoryId, React.FC | null> = {
  "admin-dashboard": AdminDashboardExample,
  "saas-dashboard": SaasDashboardExample,
  "cms": CmsExample,
  "crm": null,
  "ecommerce": EcommerceExample,
  "hr-system": HrSystemExample,
  "github-app": GithubRepoExample,
  "billing-plans": null,
  "team-management": null,
  "feature-flags": null,
};

export function GalleryPage() {
  const [activeId, setActiveId] = useState<ExampleCategoryId | null>(null);

  const activeExample = activeId ? allExamples[activeId] : null;
  const ActiveComponent = activeId ? EXAMPLE_COMPONENTS[activeId] : null;

  // If an example is selected, show it
  if (activeId && ActiveComponent) {
    return (
      <div className="min-h-screen">
        {/* Back button */}
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <button
            onClick={() => setActiveId(null)}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors duration-150 cursor-pointer bg-transparent border-none font-mono"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 4l-4 4 4 4" />
            </svg>
            Back to Gallery
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <ActiveComponent />
        </div>
      </div>
    );
  }

  // Gallery overview
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden py-20 md:py-28 bg-[#08080a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FeaturePill label="Real-World Testing" />
          <h1 className="text-[clamp(36px,6vw,72px)] font-bold -tracking-[0.03em] leading-[1.1] text-foreground mt-4 mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Integration Gallery
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Real-world Accessly usage across multiple app patterns.
            Each example tests different APIs through a practical mini application.
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 mb-6">
        <div className="flex items-center gap-3 text-xs text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            {Object.values(EXAMPLE_COMPONENTS).filter(Boolean).length} implemented
          </span>
          <span className="text-muted-dark">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-muted-dark" />
            {Object.values(EXAMPLE_COMPONENTS).filter(c => c === null).length} planned
          </span>
          <span className="text-muted-dark">·</span>
          <span>{Object.keys(allExamples).length} total</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exampleCategories.map((cat) => {
            const isImplemented = EXAMPLE_COMPONENTS[cat.id] !== null;
            const example = allExamples[cat.id];

            return (
              <button
                key={cat.id}
                onClick={() => isImplemented && setActiveId(cat.id)}
                disabled={!isImplemented}
                className={cn(
                  "text-left rounded-xl border transition-all duration-200 p-5",
                  isImplemented
                    ? "border-border bg-surface hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg cursor-pointer"
                    : "border-border/40 bg-surface/20 opacity-60 cursor-not-allowed",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  {isImplemented ? (
                    <Badge variant="allowed">Live</Badge>
                  ) : (
                    <Badge variant="neutral">Planned</Badge>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{cat.label}</h3>
                <p className="text-xs text-muted leading-relaxed">{cat.description}</p>
                {example && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {example.apisTested.slice(0, 4).map((api) => (
                      <span
                        key={api}
                        className="text-[8px] font-mono text-accent bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10"
                      >
                        {api}
                      </span>
                    ))}
                    {example.apisTested.length > 4 && (
                      <span className="text-[8px] font-mono text-muted-dark">
                        +{example.apisTested.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
