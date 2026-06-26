interface FeaturePillProps {
  label: string;
}

export function FeaturePill({ label }: FeaturePillProps) {
  return (
    <span className="feature-pill">
      {label}
    </span>
  );
}
