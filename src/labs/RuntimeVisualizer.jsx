import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Runtime Visualizer",
    intro:
      "Follow a tiny program through the whole pipeline: source → tokens → AST → execution. Press Play or step through it yourself.",
    phases: {
      source: "SOURCE",
      tokens: "TOKENS",
      ast: "AST",
      execution: "EXECUTION",
    },
    memory: "Memory",
    stack: "Call stack",
    console: "Console",
    empty: "—",
    frameNote: "frame",
  },
  es: {
    title: "Visualizador del runtime",
    intro:
      "Sigue un programa minúsculo por todo el pipeline: código → tokens → AST → ejecución. Pulsa Reproducir o avanza paso a paso.",
    phases: {
      source: "CÓDIGO",
      tokens: "TOKENS",
      ast: "AST",
      execution: "EJECUCIÓN",
    },
    memory: "Memoria",
    stack: "Pila de llamadas",
    console: "Consola",
    empty: "—",
    frameNote: "marco",
  },
};

const SOURCE = `let x = 5;

function double(n) {
  return n * 2;
}

const y = double(x);
console.log(y);`;

const TOKENS = ["let", "x", "=", "5", ";"];

const AST = {
  type: "VariableDeclaration",
  kind: "let",
  children: [
    {
      type: "VariableDeclarator",
      id: "x",
      children: [{ type: "Literal", value: "5", children: [] }],
    },
  ],
};

/**
 * Scripted steps. Each: phase, optional tokens/ast/memory/stack/console,
 * narration in both languages.
 */
const STEPS = [
  {
    phase: "source",
    narration: {
      en: "Everything starts as plain text — the source code you wrote.",
      es: "Todo empieza como texto plano — el código que escribiste.",
    },
  },
  {
    phase: "tokens",
    narration: {
      en: "The lexer scans the text and produces tokens — the smallest meaningful pieces.",
      es: "El lexer recorre el texto y produce tokens — las piezas mínimas con significado.",
    },
  },
  {
    phase: "ast",
    narration: {
      en: "The parser builds an Abstract Syntax Tree: the structure of `let x = 5;`, ready for the engine.",
      es: "El parser construye un Árbol de Sintaxis Abstracta: la estructura de `let x = 5;`, lista para el motor.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5 },
    narration: {
      en: "Execution begins. `let x = 5` stores 5 in memory.",
      es: "Empieza la ejecución. `let x = 5` guarda 5 en memoria.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5, "double ƒ": "function" },
    narration: {
      en: "The function declaration double is registered in memory — before its body ever runs.",
      es: "La declaración de función double se registra en memoria — antes de que su cuerpo se ejecute nunca.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5, "double ƒ": "function" },
    stack: [{ fn: "double", vars: { n: 5 } }],
    narration: {
      en: "Calling double(x) pushes a new frame on the call stack, with n = 5.",
      es: "Llamar a double(x) apila un nuevo marco en la pila de llamadas, con n = 5.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5, "double ƒ": "function" },
    stack: [],
    returned: 10,
    narration: {
      en: "`return n * 2` pops the frame and hands 10 back to the caller.",
      es: "`return n * 2` desapila el marco y devuelve 10 al llamador.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5, y: 10, "double ƒ": "function" },
    stack: [],
    narration: {
      en: "`const y` stores the returned value in memory.",
      es: "`const y` guarda el valor devuelto en memoria.",
    },
  },
  {
    phase: "execution",
    memory: { x: 5, y: 10, "double ƒ": "function" },
    stack: [],
    console: ["10"],
    narration: {
      en: "console.log(y) prints 10. The stack is empty — the program is done.",
      es: "console.log(y) imprime 10. La pila está vacía — el programa ha terminado.",
    },
  },
];

function AstNode({ node, depth }) {
  return (
    <div
      style={{
        marginLeft: depth * 18,
        borderLeft: "2px solid var(--accent)",
        padding: "4px 0 4px 10px",
        marginTop: 4,
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
      }}
    >
      <span style={{ color: "var(--accent)", fontWeight: 700 }}>{node.type}</span>
      {node.kind && <span style={{ color: "var(--muted)" }}> ({node.kind})</span>}
      {node.id && (
        <span>
          {" "}
          id=<code>{node.id}</code>
        </span>
      )}
      {node.value && (
        <span>
          {" "}
          value=<code>{node.value}</code>
        </span>
      )}
      {node.children.map((c, i) => (
        <AstNode key={i} node={c} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function RuntimeVisualizer() {
  const { t, lang } = useI18n();
  const s = STRINGS[lang];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const cur = STEPS[step];
  const last = step >= STEPS.length - 1;

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setPlaying(false);
  };

  useEffect(() => stop, []);

  const play = () => {
    if (last) setStep(0);
    setPlaying(true);
    timer.current = setInterval(() => {
      setStep((v) => {
        if (v + 1 >= STEPS.length) {
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 1400);
  };

  const advance = () => {
    stop();
    setStep((v) => Math.min(v + 1, STEPS.length - 1));
  };

  const reset = () => {
    stop();
    setStep(0);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="lab-controls" role="group" aria-label={s.title}>
          <button type="button" className="btn btn-primary btn-sm" onClick={play} disabled={playing}>
            ▶ {t("labs.play")}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={advance}
            disabled={playing || last}
          >
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t("labs.reset")}
          </button>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", alignSelf: "center" }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <div className="lab-controls" role="tablist" aria-label="phases">
          {["source", "tokens", "ast", "execution"].map((p) => (
            <span
              key={p}
              className={`badge ${cur.phase === p ? "advanced" : ""}`}
              style={
                cur.phase === p
                  ? { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }
                  : undefined
              }
            >
              {s.phases[p]}
            </span>
          ))}
        </div>

        <div className="lab-stage" aria-live="polite">
          {cur.phase === "source" && (
            <div className="code-block" style={{ margin: 0 }}>
              <pre>
                <HighlightedCode code={SOURCE} />
              </pre>
            </div>
          )}

          {cur.phase === "tokens" && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TOKENS.map((tok, i) => (
                <span
                  key={i}
                  className="badge anim-in"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1rem",
                    padding: "8px 14px",
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    animationDelay: `${i * 120}ms`,
                  }}
                >
                  {tok}
                </span>
              ))}
            </div>
          )}

          {cur.phase === "ast" && <AstNode node={AST} depth={0} />}

          {cur.phase === "execution" && (
            <div className="grid-2" style={{ margin: 0 }}>
              <div>
                <h4 style={{ fontSize: "0.85rem", margin: "0 0 8px" }}>{s.stack}</h4>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    minHeight: 90,
                    padding: 8,
                    display: "flex",
                    flexDirection: "column-reverse",
                    gap: 6,
                  }}
                >
                  {(cur.stack || []).length === 0 ? (
                    <span style={{ color: "var(--faint)", fontSize: "0.85rem" }}>{s.empty}</span>
                  ) : (
                    cur.stack.map((f, i) => (
                      <div
                        key={i}
                        className="badge anim-in"
                        style={{
                          fontFamily: "var(--font-mono)",
                          padding: "8px 12px",
                          background: "var(--accent-dim)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent)",
                          textAlign: "left",
                        }}
                      >
                        {f.fn}(
                        {Object.entries(f.vars)
                          .map(([k, v]) => `${k} = ${v}`)
                          .join(", ")}
                        )
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", margin: "0 0 8px" }}>{s.memory}</h4>
                <table className="data-table">
                  <tbody>
                    {Object.entries(cur.memory || {}).map(([k, v]) => (
                      <tr key={k}>
                        <td>
                          <code>{k}</code>
                        </td>
                        <td style={{ fontFamily: "var(--font-mono)" }}>{String(v)}</td>
                      </tr>
                    ))}
                    {cur.returned !== undefined && (
                      <tr>
                        <td>
                          <code>↩ return</code>
                        </td>
                        <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                          {cur.returned}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <h4 style={{ fontSize: "0.85rem", margin: "0 0 8px" }}>{s.console}</h4>
                <div className="console">
                  <div className="console-body">
                    {(cur.console || []).length === 0 ? (
                      <div className="console-empty">{t("labs.noOutput")}</div>
                    ) : (
                      cur.console.map((line, i) => (
                        <div key={i} className="console-line">
                          <span className="lvl lvl-log">LOG</span>
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lab-explain" aria-live="polite">
          {cur.narration[lang]}
        </div>
      </div>
    </div>
  );
}
