interface FeaturePillProps {
  label: string;
}

export function FeaturePill({ label }: FeaturePillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-accent bg-primary-light border border-primary/20">
      {label}
    </span>
  );
}
