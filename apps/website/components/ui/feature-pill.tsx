interface FeaturePillProps {
  label: string;
}

export function FeaturePill({ label }: FeaturePillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-subtle)] border border-[var(--color-primary-mid)] mb-5">
      {label}
    </span>
  );
}
