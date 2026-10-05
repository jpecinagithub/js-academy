import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";

const STRINGS = {
  en: {
    title: "Object Explorer",
    sub: "Paste any JSON and explore it as an interactive tree. Click a node to select it and see its path.",
    json: "JSON input",
    parse: "Parse JSON",
    tree: "Object tree",
    path: "Selected path",
    noSelection: "Click any node in the tree to see its path here.",
    root: "(root)",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    keys: "keys",
    items: "items",
    errorTitle: "That JSON doesn't parse",
    errorBody: "JSON.parse threw an error — check for missing quotes, trailing commas, or unquoted keys:",
    tip: "Tip: property names and strings must use double quotes in JSON.",
  },
  es: {
    title: "Explorador de objetos",
    sub: "Pega cualquier JSON y explóralo como un árbol interactivo. Pulsa un nodo para seleccionarlo y ver su ruta.",
    json: "Entrada JSON",
    parse: "Analizar JSON",
    tree: "Árbol del objeto",
    path: "Ruta seleccionada",
    noSelection: "Pulsa cualquier nodo del árbol para ver su ruta aquí.",
    root: "(raíz)",
    expandAll: "Expandir todo",
    collapseAll: "Colapsar todo",
    keys: "claves",
    items: "elementos",
    errorTitle: "Ese JSON no se puede analizar",
    errorBody: "JSON.parse lanzó un error — revisa comillas ausentes, comas finales o claves sin comillas:",
    tip: "Consejo: los nombres de propiedad y las cadenas deben usar comillas dobles en JSON.",
  },
};

const DEFAULT_JSON = `{
  "name": "Ana",
  "skills": ["JavaScript", "React"],
  "location": { "city": "Madrid" }
}`;

const TYPE_STYLE = {
  object: { bg: "var(--blue-dim)", fg: "var(--blue)" },
  array: { bg: "var(--violet)22", fg: "var(--violet)" },
  string: { bg: "var(--accent-dim)", fg: "var(--accent)" },
  number: { bg: "var(--amber-dim)", fg: "var(--amber)" },
  boolean: { bg: "var(--amber-dim)", fg: "var(--amber)" },
  null: { bg: "var(--surface-3)", fg: "var(--faint)" },
};

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function formatPath(segments) {
  // ["location", "city"] -> location.city ; ["skills", 1] -> skills[1]
  if (segments.length === 0) return "";
  let out = String(segments[0]);
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    out += typeof seg === "number" ? `[${seg}]` : `.${seg}`;
  }
  return out;
}

export default function ObjectExplorer() {
  const { lang } = useI18n();
  const s = STRINGS[lang];

  const [text, setText] = useState(DEFAULT_JSON);
  const [data, setData] = useState(() => JSON.parse(DEFAULT_JSON));
  const [error, setError] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [expanded, setExpanded] = useState({ "": true }); // pathKey -> bool

  const parse = () => {
    try {
      const parsed = JSON.parse(text);
      setData(parsed);
      setError(null);
      setSelectedPath([]);
      setExpanded({ "": true });
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  };

  const collectKeys = (value, segments, acc) => {
    const t = typeOf(value);
    if (t === "object" || t === "array") {
      acc.push(formatPath(segments));
      const entries = t === "array" ? value.map((v, i) => [i, v]) : Object.entries(value);
      entries.forEach(([k, v]) => collectKeys(v, [...segments, k], acc));
    }
    return acc;
  };

  const expandAll = () => {
    if (!data) return;
    const keys = collectKeys(data, [], []);
    const map = {};
    keys.forEach((k) => (map[k] = true));
    map[""] = true;
    setExpanded(map);
  };

  const collapseAll = () => setExpanded({ "": true });

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.json}
          </div>
          <div className="panel-body">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label={s.json}
              spellCheck={false}
              style={textareaStyle}
              rows={10}
            />
            <div className="lab-controls" style={{ marginTop: 10 }}>
              <button className="btn btn-primary" onClick={parse}>
                {s.parse}
              </button>
            </div>
            {error && (
              <div className="callout anim-in" style={{ borderColor: "var(--red)", marginTop: 12 }} role="alert">
                <strong style={{ color: "var(--red)" }}>⚠ {s.errorTitle}</strong>
                <p style={{ margin: "6px 0", color: "var(--muted)" }}>{s.errorBody}</p>
                <code
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--red)",
                    background: "var(--red-dim)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-s)",
                  }}
                >
                  {error}
                </code>
                <p style={{ margin: "8px 0 0", color: "var(--faint)", fontSize: 13, fontStyle: "italic" }}>{s.tip}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" />
              {s.tree}
              {data && (
                <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={expandAll}>
                    {s.expandAll}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
                    {s.collapseAll}
                  </button>
                </span>
              )}
            </div>
            <div className="panel-body" aria-live="polite">
              {data ? (
                <TreeNode
                  value={data}
                  label={s.root}
                  segments={[]}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  selectedPath={selectedPath}
                  setSelectedPath={setSelectedPath}
                  lang={lang}
                  depth={0}
                />
              ) : (
                <p style={{ color: "var(--faint)" }}>{s.errorTitle}</p>
              )}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-head">
              <span className="lamp" />
              {s.path}
            </div>
            <div className="panel-body" aria-live="polite">
              {selectedPath.length === 0 ? (
                <p style={{ color: "var(--faint)", margin: 0 }}>{s.noSelection}</p>
              ) : (
                <code
                  className="anim-in"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "var(--accent)",
                    wordBreak: "break-all",
                  }}
                >
                  {formatPath(selectedPath)}
                </code>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeNode({ value, label, segments, expanded, setExpanded, selectedPath, setSelectedPath, lang, depth }) {
  const t = typeOf(value);
  const isContainer = t === "object" || t === "array";
  const pathKey = formatPath(segments);
  const isOpen = expanded[pathKey] ?? depth < 2;
  const isSelected = formatPath(selectedPath) === pathKey;

  const toggle = () => setExpanded((e) => ({ ...e, [pathKey]: !isOpen }));

  const entries = isContainer
    ? t === "array"
      ? value.map((v, i) => [i, v])
      : Object.entries(value)
    : [];

  const count = t === "array" ? value.length : Object.keys(value).length;
  const countLabel = t === "array" ? (lang === "es" ? "elementos" : "items") : lang === "es" ? "claves" : "keys";

  const select = () => setSelectedPath(segments);

  const style = TYPE_STYLE[t];

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 14 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={select}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select();
          }
        }}
        aria-label={`${label} (${t})`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px",
          borderRadius: "var(--radius-s)",
          background: isSelected ? "var(--accent-dim)" : "transparent",
          border: isSelected ? "1px solid var(--accent)" : "1px solid transparent",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
        }}
      >
        {isContainer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            aria-label={isOpen ? "Collapse" : "Expand"}
            aria-expanded={isOpen}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 12,
              padding: 0,
              width: 18,
            }}
          >
            {isOpen ? "▾" : "▸"}
          </button>
        )}
        {!isContainer && <span style={{ width: 18 }} />}
        <span style={{ color: isContainer ? "var(--blue)" : "var(--muted)" }}>{label}</span>
        <TypeBadge type={t} style={style} />
        {isContainer && (
          <span style={{ color: "var(--faint)", fontSize: 12 }}>
            {count} {countLabel}
          </span>
        )}
        {!isContainer && (
          <span style={{ color: "var(--text)", wordBreak: "break-all" }}>
            {t === "string" ? `"${value}"` : String(value)}
          </span>
        )}
        {isContainer && !isOpen && <span style={{ color: "var(--faint)" }}>{t === "array" ? "[…]" : "{…}"}</span>}
      </div>
      {isContainer && isOpen && (
        <div className="anim-in">
          {entries.map(([k, v]) => (
            <TreeNode
              key={String(k)}
              value={v}
              label={t === "array" ? `[${k}]` : k}
              segments={[...segments, k]}
              expanded={expanded}
              setExpanded={setExpanded}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
              lang={lang}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type, style }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        padding: "2px 7px",
        borderRadius: 99,
        background: style.bg,
        color: style.fg,
      }}
    >
      {type}
    </span>
  );
}

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  borderRadius: "var(--radius-s)",
  border: "1px solid var(--border)",
  background: "var(--code-bg)",
  color: "var(--text)",
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  lineHeight: 1.6,
  resize: "vertical",
};
