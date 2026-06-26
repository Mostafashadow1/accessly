interface JsonPanelProps {
  data: unknown;
  label?: string;
}

function formatJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function JsonPanel({ data, label }: JsonPanelProps) {
  const json = formatJson(data);

  // Simple syntax highlighting — wraps values in styled spans
  const highlighted = json
    .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="json-key">$1</span>:')
    .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="json-string">$1</span>')
    .replace(/:\s*(\d+(?:\.\d+)?)/g, ': <span class="json-number">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')
    .replace(/([{}\[\]])/g, '<span class="json-punctuation">$1</span>');

  return (
    <div className="playground-panel">
      {label && (
        <div className="playground-panel-header">{label}</div>
      )}
      <div className="playground-panel-body">
        <pre
          className="m-0 text-[13px] leading-relaxed overflow-auto whitespace-pre-wrap"
          style={{ color: "var(--text-code)", fontFamily: "JetBrains Mono, monospace" }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}
