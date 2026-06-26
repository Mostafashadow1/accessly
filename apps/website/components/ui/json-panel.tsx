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

  const highlighted = json
    .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="token-key">$1</span>:')
    .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="token-string">$1</span>')
    .replace(/:\s*(\d+(?:\.\d+)?)/g, ': <span class="token-number">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="token-boolean">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="token-null">$1</span>');

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 code-panel-accent">
      {label && (
        <div className="px-4 py-2.5 bg-surface-hover border-b border-border text-xs font-semibold text-muted uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="p-5">
        <pre
          className="m-0 text-[13px] leading-relaxed overflow-auto whitespace-pre-wrap font-mono text-foreground [&>span]:font-mono"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}
