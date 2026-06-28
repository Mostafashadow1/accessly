"use client";

import { useState } from "react";
import type { Recipe } from "@/types/lab";
import { RECIPES } from "@/data/lab-examples";

interface RecipeGalleryProps {
  isVisible: boolean;
  onSelectBackend: (backendId: string) => void;
  onSelectPermission: (permission: string) => void;
  onSwitchMode: () => void;
}

export function RecipeGallery({
  isVisible,
  onSelectBackend,
  onSelectPermission,
  onSwitchMode,
}: RecipeGalleryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isVisible) return null;

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-foreground mb-1">
          Recipes
        </div>
        <p className="text-xs text-muted-dark/70 leading-relaxed">
          Practical permission patterns. Each recipe shows a real scenario, a live
          demo, and code you can use.
        </p>
      </div>

      <div className="grid gap-3">
        {RECIPES.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isExpanded={expandedId === recipe.id}
            onToggle={() =>
              setExpandedId(expandedId === recipe.id ? null : recipe.id)
            }
            onTryInPlayground={() => {
              onSelectBackend(recipe.backendId);
              onSelectPermission(recipe.permission);
              onSwitchMode();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  isExpanded,
  onToggle,
  onTryInPlayground,
}: {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
  onTryInPlayground: () => void;
}) {
  return (
    <div
      className={`
        rounded-xl border transition-all duration-200
        ${
          isExpanded
            ? "border-primary/30 bg-surface shadow-lg shadow-primary/5"
            : "border-border/10 bg-surface/20 hover:border-border/30 hover:bg-surface/30"
        }
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm"
          style={{ backgroundColor: `${recipe.color}15` }}
        >
          {recipe.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {recipe.title}
          </div>
          <div className="text-[10px] text-muted-dark/60 truncate">
            {recipe.problem}
          </div>
        </div>
        <span
          className={`shrink-0 text-muted-dark transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border/10 pt-3 space-y-3">
          <p className="text-xs text-muted-dark leading-relaxed">
            {recipe.explanation}
          </p>

          {/* Code snippet */}
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-[9px] text-muted-dark/40 font-mono mb-2">
              {`// Usage example`}
            </div>
            <pre className="text-[10px] font-mono text-muted-dark/70 leading-relaxed">
              <span className="text-primary/60">{`import { Can } from "accessly";\n\n`}</span>
              {`<Can permission={"`}
              <span className="text-emerald-400/80">{recipe.permission}</span>
              {`"}>\n  `}
              <span className="text-muted-dark/40">{`<ProtectedComponent />`}</span>
              {`\n</Can>`}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTryInPlayground}
              className="text-[10px] px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Try in Playground
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(recipe.explanation);
              }}
              className="text-[10px] px-3 py-1.5 rounded-lg bg-surface/40 border border-border/15 text-muted-dark hover:text-foreground transition-colors"
            >
              Copy Explanation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
