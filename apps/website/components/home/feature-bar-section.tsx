import { features } from "@/data/features";

/**
 * FeatureBarSection — compact feature bar with icons and labels.
 * Sits between the playground and the "How it works" section.
 */
export function FeatureBarSection() {
  return (
    <section className="border-y border-border bg-[rgba(10,10,12,0.8)]">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap lg:flex-nowrap">
          {features.map((f, i) => (
            <div
              key={f.label}
              className={`flex-1 min-w-[160px] flex items-center gap-3 py-[22px] px-6 cursor-default transition-colors duration-200 hover:bg-primary-light/40 ${
                i < features.length - 1 ? "border-r border-border" : ""
              }`}
            >
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-[13px] font-semibold text-foreground leading-tight">
                  {f.label}
                </div>
                <div className="text-[11px] text-muted">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
