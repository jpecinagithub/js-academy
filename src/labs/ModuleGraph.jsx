import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Module Graph",
    intro:
      "A tiny sample app, as the bundler sees it. Click a node to inspect what it imports and exports — named vs default.",
    imports: "Imports",
    exports: "Exports",
    named: "named",
    default: "default",
    from: "from",
    code: "Source",
    clickHint: "Click a module node to inspect it.",
    explainerTitle: "Named vs default",
    explainer:
      "A module can export many named values (imported with { }) but only one default (imported without braces). Here ui.js exports a single render function as default; math.js exports sum and average as named values.",
  },
  es: {
    title: "Grafo de módulos",
    intro:
      "Una pequeña app de ejemplo, vista como la ve el empaquetador. Haz clic en un nodo para inspeccionar lo que importa y exporta — nombrado vs default.",
    imports: "Importa",
    exports: "Exporta",
    named: "nombrado",
    default: "por defecto",
    from: "de",
    code: "Código",
    clickHint: "Haz clic en un nodo de módulo para inspeccionarlo.",
    explainerTitle: "Nombrado vs default",
    explainer:
      "Un módulo puede exportar muchos valores nombrados (se importan con { }) pero solo un default (se importa sin llaves). Aquí ui.js exporta una sola función render como default; math.js exporta sum y average como valores nombrados.",
  },
};

const MODULES = {
  "app.js": {
    x: 270,
    y: 20,
    imports: [
      { from: "math.js", named: ["sum", "average"], def: null },
      { from: "ui.js", named: [], def: "render" },
    ],
    exports: { named: [], def: null },
    code: `import { sum, average } from "./math.js";
import render from "./ui.js";

const data = [4, 8, 15, 16, 23, 42];
console.log("sum:", sum(data));
render(average(data));`,
  },
  "math.js": {
    x: 60,
    y: 150,
    imports: [{ from: "utils.js", named: ["clamp"], def: null }],
    exports: { named: ["sum", "average"], def: null },
    code: `import { clamp } from "./utils.js";

export function sum(xs) {
  return xs.reduce((a, x) => a + x, 0);
}

export function average(xs) {
  return clamp(sum(xs) / xs.length, 0, 100);
}`,
  },
  "ui.js": {
    x: 480,
    y: 150,
    imports: [],
    exports: { named: [], def: "render" },
    code: `export default function render(value) {
  document.querySelector("#out").textContent = value;
}`,
  },
  "utils.js": {
    x: 60,
    y: 285,
    imports: [],
    exports: { named: ["clamp"], def: null },
    code: `export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}`,
  },
};

const EDGES = [
  ["app.js", "math.js"],
  ["app.js", "ui.js"],
  ["math.js", "utils.js"],
];

const W = 100;
const H = 52;

function anchor(mod, side) {
  const m = MODULES[mod];
  return side === "bottom"
    ? { x: m.x + W / 2, y: m.y + H }
    : { x: m.x + W / 2, y: m.y };
}

export default function ModuleGraph() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [active, setActive] = useState("app.js");
  const mod = MODULES[active];

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="lab-stage">
            <svg
              viewBox="0 0 640 360"
              role="img"
              aria-label={s.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <defs>
                <marker
                  id="mg-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" style={{ fill: "var(--accent)" }} />
                </marker>
              </defs>
              {EDGES.map(([from, to]) => {
                const a = anchor(from, "bottom");
                const b = anchor(to, "top");
                return (
                  <line
                    key={from + to}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeWidth="2"
                    markerEnd="url(#mg-arrow)"
                    opacity="0.8"
                    style={{ stroke: "var(--accent)" }}
                  />
                );
              })}
              {Object.entries(MODULES).map(([name, m]) => {
                const isActive = name === active;
                return (
                  <g
                    key={name}
                    onClick={() => setActive(name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActive(name);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={name}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={m.x}
                      y={m.y}
                      width={W}
                      height={H}
                      rx="10"
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{
                        fill: isActive ? "var(--accent-dim)" : "var(--surface-2)",
                        stroke: isActive ? "var(--accent)" : "var(--border-strong)",
                      }}
                    />
                    <text
                      x={m.x + W / 2}
                      y={m.y + H / 2 + 5}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      style={{
                        fill: isActive ? "var(--accent)" : "var(--text)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>{active}</h3>
            {!mod ? (
              <p style={{ color: "var(--muted)" }}>{s.clickHint}</p>
            ) : (
              <>
                <h4 style={{ fontSize: "0.85rem", margin: "12px 0 6px" }}>{s.imports}</h4>
                {mod.imports.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>—</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.9rem" }}>
                    {mod.imports.map((im, i) => (
                      <li key={i}>
                        {im.named.length > 0 && (
                          <>
                            <code>{`{ ${im.named.join(", ")} }`}</code>{" "}
                            <span className="badge beginner">{s.named}</span>{" "}
                          </>
                        )}
                        {im.def && (
                          <>
                            <code>{im.def}</code> <span className="badge advanced">{s.default}</span>{" "}
                          </>
                        )}
                        <span style={{ color: "var(--muted)" }}>
                          {s.from} <code>{im.from}</code>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <h4 style={{ fontSize: "0.85rem", margin: "12px 0 6px" }}>{s.exports}</h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.9rem" }}>
                  {mod.exports.named.map((n) => (
                    <li key={n}>
                      <code>{n}</code> <span className="badge beginner">{s.named}</span>
                    </li>
                  ))}
                  {mod.exports.def && (
                    <li>
                      <code>{mod.exports.def}</code> <span className="badge advanced">{s.default}</span>
                    </li>
                  )}
                  {mod.exports.named.length === 0 && !mod.exports.def && (
                    <li style={{ color: "var(--muted)" }}>—</li>
                  )}
                </ul>
                <h4 style={{ fontSize: "0.85rem", margin: "12px 0 6px" }}>{s.code}</h4>
                <div className="code-block">
                  <pre>
                    <HighlightedCode code={mod.code} />
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="takeaway">
          <strong>💡 {s.explainerTitle}: </strong>
          {s.explainer}
        </div>
      </div>
    </div>
  );
}
