import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "./highlight.jsx";

/**
 * Lite markdown renderer for lesson content.
 * Supported: paragraphs, ## headings, **bold**, `code`, ``` code fences,
 * - bullets, 1. numbered lists, > quotes. Authors must stick to this subset.
 */
export function Markdown({ text }) {
  const blocks = String(text || "").split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} text={b} />
      ))}
    </>
  );
}

function Block({ text }) {
  const t = text.trim();
  if (t.startsWith("```")) {
    const code = t.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    return (
      <div className="code-block">
        <pre>{code}</pre>
      </div>
    );
  }
  if (t.startsWith("## ")) {
    return <h2>{inline(t.slice(3))}</h2>;
  }
  if (t.startsWith("> ")) {
    return (
      <div className="callout">
        <Markdown text={t.replace(/^> /gm, "")} />
      </div>
    );
  }
  const lines = t.split("\n");
  if (lines.every((l) => /^\s*-\s+/.test(l))) {
    return (
      <ul>
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^\s*-\s+/, ""))}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
    return (
      <ol>
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>
        ))}
      </ol>
    );
  }
  return <p>{inline(t)}</p>;
}

function inline(text) {
  // `code` first, then **bold**
  const parts = String(text).split(/(`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
      return (
        <code key={i} className="inline">
          {p.slice(1, -1)}
        </code>
      );
    }
    const bold = p.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {bold.map((b, j) =>
          b.startsWith("**") && b.endsWith("**") ? (
            <strong key={j}>{b.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{b}</span>
          )
        )}
      </span>
    );
  });
}

/** Static code block with copy button and optional "run in sandbox" hook. */
export function CodeBlock({ code, caption, onRun, runnable }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <figure style={{ margin: "16px 0" }}>
      <div className="code-block">
        <div className="code-actions">
          {runnable && (
            <button type="button" className="btn btn-sm btn-primary" onClick={() => onRun && onRun(code)}>
              ▶ {t("labs.run")}
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={copy}
            aria-label={t("labs.copy")}
          >
            {copied ? t("labs.copied") : t("labs.copy")}
          </button>
        </div>
        <pre>
          <HighlightedCode code={code} />
        </pre>
      </div>
      {caption && <figcaption className="code-caption">{caption}</figcaption>}
    </figure>
  );
}
