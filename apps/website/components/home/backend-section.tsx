"use client";

import { useState } from "react";
import { backendAdapters, backendList } from "@/data/backend-examples";

/**
 * FlowArrow — vertical arrow for the stacked panels.
 */
function FlowArrow({ active = true }: { active?: boolean }) {
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <path
          d="M8 0 L8 18"
          stroke={active ? "#6366f1" : "#3a3a42"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className={active ? "[stroke-dasharray:5_3] animate-[flow_1s_linear_infinite]" : ""}
        />
        <path
          d="M4 14 L8 20 L12 14"
          stroke={active ? "#6366f1" : "#3a3a42"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * BackendSection — shows how any backend API shape is normalized.
 */
export function BackendSection() {
  const [activeBackend, setActiveBackend] = useState(0);

  return (
    <section className="py-[100px] md:py-[140px] border-b border-border">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: heading + description */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-accent bg-primary-light border border-primary/15 mb-5">Integration</div>
              <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold -tracking-[0.03em] leading-[1.08] text-foreground mt-4">
                Your backend,
                <br />
                any shape
              </h2>
            </div>
            <p className="text-[15px] text-muted leading-relaxed max-w-[460px]">
              Every API returns permissions differently. Laravel uses arrays.
              NestJS uses abilities. ASP.NET uses claims. Accessly normalizes
              all of them into one consistent model.
            </p>
            <ul className="flex flex-col gap-2.5 list-none">
              {backendList.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: tabs + panels */}
          <div className="flex flex-col gap-4">
            {/* Selector tabs */}
            <div className="flex flex-wrap gap-2">
              {backendAdapters.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveBackend(idx)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                    activeBackend === idx
                      ? "border border-primary/40 bg-primary/10 text-accent"
                      : "border border-border bg-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Stacked panels with arrows */}
            <div className="flex flex-col gap-1.5">
              {[
                {
                  title: "Backend Response",
                  code: backendAdapters[activeBackend].response,
                  accent: "text-muted",
                },
                {
                  title: "Accessly Adapter",
                  code: backendAdapters[activeBackend].adapter,
                  accent: "text-accent-foreground",
                },
                {
                  title: "Unified AccessModel",
                  code: backendAdapters[activeBackend].model,
                  accent: "text-success",
                },
              ].map((panel, idx) => (
                <div key={panel.title}>
                  <div className="rounded-xl border border-border bg-[rgba(6,6,8,0.7)] backdrop-blur-md overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 min-h-[40px] border-b border-border bg-[rgba(12,12,15,0.8)]">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.05em] ${panel.accent}`}
                      >
                        {panel.title}
                      </span>
                    </div>
                    <pre className="m-0 p-3.5 text-[11px] font-mono leading-relaxed text-foreground/65 overflow-auto max-h-[140px]">
                      {panel.code}
                    </pre>
                  </div>
                  {idx < 2 && <FlowArrow active={true} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
