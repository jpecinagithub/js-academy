import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { highlightJS } from "./highlight.jsx";

/**
 * Lightweight code editor: transparent textarea over a highlighted <pre>.
 * Keeps the bundle tiny (no Monaco/CodeMirror) while feeling like an IDE.
 */
export function CodeEditor({ value, onChange, label, minHeight = 220, id }) {
  const { t } = useI18n();
  const preRef = useRef(null);
  const taRef = useRef(null);
  const [editorId] = useState(() => id || `ed-${Math.random().toString(36).slice(2, 8)}`);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  useEffect(syncScroll, [value]);

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="editor" style={{ minHeight }}>
      <pre ref={preRef} aria-hidden="true">
        {highlightJS(value + "\n")}
      </pre>
      <textarea
        ref={taRef}
        id={editorId}
        aria-label={label || t("playground.editor")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        style={{ minHeight }}
      />
    </div>
  );
}
