/**
 * JsonPanel — safe recursive JSON renderer.
 *
 * Replaces the previous dangerouslySetInnerHTML + regex approach.
 * Walks the JSON tree and renders each value as a typed <span>.
 * Zero XSS risk regardless of data source.
 */

interface JsonPanelProps {
  data: unknown;
  label?: string;
}

/* ── Token colors — matches standard dark-theme syntax highlighting ── */
const TOKEN = {
  key:     "#a5b4fc",  /* accent / indigo-300 */
  string:  "#86efac",  /* green-300 */
  number:  "#fbbf24",  /* amber-400 */
  boolean: "#60a5fa",  /* blue-400 */
  null:    "#6b7280",  /* gray-500 */
  bracket: "#8c8c99",  /* muted */
} as const;

/* ── Recursive renderer ── */
function JsonNode({
  value,
  indent = 0,
  isLast = true,
}: {
  value: unknown;
  indent?: number;
  isLast?: boolean;
}) {
  const pad = " ".repeat(indent * 2);
  const comma = isLast ? "" : ",";

  if (value === null) {
    return (
      <>
        <span style={{ color: TOKEN.null }}>null</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  if (typeof value === "boolean") {
    return (
      <>
        <span style={{ color: TOKEN.boolean }}>{String(value)}</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  if (typeof value === "number") {
    return (
      <>
        <span style={{ color: TOKEN.number }}>{value}</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  if (typeof value === "string") {
    return (
      <>
        <span style={{ color: TOKEN.string }}>&quot;{value}&quot;</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <>
          <span style={{ color: TOKEN.bracket }}>[]</span>
          {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
        </>
      );
    }
    return (
      <>
        <span style={{ color: TOKEN.bracket }}>{"["}</span>
        {"\n"}
        {value.map((item, i) => (
          <span key={i}>
            {pad}{"  "}
            <JsonNode value={item} indent={indent + 1} isLast={i === value.length - 1} />
            {"\n"}
          </span>
        ))}
        {pad}
        <span style={{ color: TOKEN.bracket }}>]</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <>
          <span style={{ color: TOKEN.bracket }}>{"{}"}</span>
          {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
        </>
      );
    }
    return (
      <>
        <span style={{ color: TOKEN.bracket }}>{"{"}</span>
        {"\n"}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {pad}{"  "}
            <span style={{ color: TOKEN.key }}>&quot;{k}&quot;</span>
            <span style={{ color: TOKEN.bracket }}>: </span>
            <JsonNode value={v} indent={indent + 1} isLast={i === entries.length - 1} />
            {"\n"}
          </span>
        ))}
        {pad}
        <span style={{ color: TOKEN.bracket }}>{"}"}</span>
        {comma && <span style={{ color: TOKEN.bracket }}>{comma}</span>}
      </>
    );
  }

  return <span style={{ color: TOKEN.bracket }}>{String(value)}</span>;
}

export function JsonPanel({ data, label }: JsonPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {label && (
        <div className="px-4 py-2.5 bg-surface-hover border-b border-border text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">
          {label}
        </div>
      )}
      <div className="p-5 overflow-auto">
        <pre className="m-0 text-[12px] leading-relaxed font-mono whitespace-pre">
          <JsonNode value={data} />
        </pre>
      </div>
    </div>
  );
}
