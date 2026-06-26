export function PipelineArrow({
  highlighted,
}: {
  highlighted?: boolean;
}) {
  return (
    <div
      className={`hidden md:flex items-center justify-center shrink-0 transition-colors duration-300 ${
        highlighted ? "text-primary" : "text-muted-dark/40"
      }`}
      aria-hidden="true"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </div>
  );
}
