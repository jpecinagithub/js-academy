import { useMemo } from "react";

/**
 * Tiny dependency-free JavaScript syntax highlighter.
 * Tokenizes comments, strings, template literals, numbers, keywords,
 * function calls and punctuation. Good enough for pedagogy.
 */

const KEYWORDS = new Set(
  "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield async await of static get set".split(
    " "
  )
);

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d[\d_]*(?:\.\d+)?(?:n)?)\b|\b([A-Za-z_$][\w$]*)(?=\s*\()|\b([A-Za-z_$][\w$]*)\b|(\s+|.)/g;

export function highlightJS(code) {
  const out = [];
  let m;
  let key = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    const [tok, comment, str, num, fn, word, other] = m;
    const k = key++;
    if (comment) out.push(<span key={k} className="tok-com">{tok}</span>);
    else if (str) out.push(<span key={k} className="tok-str">{tok}</span>);
    else if (num) out.push(<span key={k} className="tok-num">{tok}</span>);
    else if (fn) out.push(<span key={k} className="tok-fn">{tok}</span>);
    else if (word)
      out.push(
        KEYWORDS.has(word) ? (
          <span key={k} className="tok-kw">{tok}</span>
        ) : (
          <span key={k}>{tok}</span>
        )
      );
    else out.push(<span key={k} className={/^\s+$/.test(other) ? undefined : "tok-op"}>{tok}</span>);
  }
  return out;
}

/** Highlight with specific line numbers emphasized (1-based). */
export function HighlightedCode({ code, highlightLines = [] }) {
  const lines = useMemo(() => String(code).split("\n"), [code]);
  const hl = useMemo(() => new Set(highlightLines), [highlightLines]);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={hl.has(i + 1) ? "code-line-hl" : undefined}>
          {highlightJS(line || " ")}
          {i < lines.length - 1 ? "\n" : ""}
        </span>
      ))}
    </>
  );
}
