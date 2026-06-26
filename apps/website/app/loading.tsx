export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-56px)]"
      aria-label="Loading"
      role="status"
    >
      {/* Three-dot pulse loader */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60 animate-[pulse-live_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.2}s` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
