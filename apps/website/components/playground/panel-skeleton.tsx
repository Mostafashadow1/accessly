const widths = ["w-3/5", "w-4/5", "w-2/5", "w-3/4", "w-1/2", "w-5/6"];

export function PanelSkeleton({ lines }: { lines: number }) {
  return (
    <div className="animate-pulse flex flex-col gap-2 p-1" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded bg-white/[0.06] ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}
