import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/**
 * ClosureExplorer — the counter that remembers.
 * Real JS closures run the show: each counter holds its birth scope alive.
 */

const STRINGS = {
  en: {
    title: "ClosureExplorer",
    sub: "Create a counter, call it, and watch the closed-over variable survive between calls.",
    create: "Create counter",
    call: "Call {name}()",
    counters: "Live closures",
    consoleOut: "Console",
    birthScope: "birth scope (kept alive)",
    closedCell: "closed-over cell",
    calls: "calls",
    explainTitle: "What's a closure?",
    explain:
      "When counter() ran, its inner function captured the variable count from its birth scope. Even though counter() has finished, that scope stays alive as long as the inner function can reach it — that persistent pairing of function + birth scope is a closure.",
    explain2:
      "Each call to counter() creates a FRESH birth scope, so c and c2 remember completely independent counts.",
    counterName: (n) => (n === 1 ? "c" : `c${n}`),
  },
  es: {
    title: "ClosureExplorer",
    sub: "Crea un contador, llámalo y observa cómo la variable capturada sobrevive entre llamadas.",
    create: "Crear contador",
    call: "Llamar {name}()",
    counters: "Closures vivos",
    consoleOut: "Consola",
    birthScope: "ámbito de nacimiento (sigue vivo)",
    closedCell: "celda capturada",
    calls: "llamadas",
    explainTitle: "¿Qué es un closure?",
    explain:
      "Cuando counter() se ejecutó, su función interna capturó la variable count de su ámbito de nacimiento. Aunque counter() ya terminó, ese ámbito sigue vivo mientras la función interna pueda alcanzarlo: esa unión persistente de función + ámbito de nacimiento es un closure.",
    explain2:
      "Cada llamada a counter() crea un ámbito de nacimiento NUEVO, así que c y c2 recuerdan cuentas totalmente independientes.",
    counterName: (n) => (n === 1 ? "c" : `c${n}`),
  },
};

const CODE = `function counter() {
  let count = 0;              // ← lives in counter()'s scope
  return function () {        // ← this inner function
    count++;                  //    captures "count"…
    return count;
  };
}
const c = counter();          // counter() finishes here…`;

/** Real closure: the returned function keeps its birth scope alive. */
function makeCounter() {
  let count = 0;
  const fn = () => {
    count += 1;
    return count;
  };
  return { fn, getCount: () => count };
}

export default function ClosureExplorer() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];
  const [counters, setCounters] = useState([]); // [{ id, name, fn, getCount, count, calls }]
  const [log, setLog] = useState([]);

  const createCounter = () => {
    const n = counters.length + 1;
    const { fn, getCount } = makeCounter();
    const name = s.counterName(n);
    setCounters((cs) => [...cs, { id: n, name, fn, getCount, count: 0, calls: 0 }]);
    setLog((l) => [...l, `const ${name} = counter();`]);
  };

  const callCounter = (id) => {
    const c = counters.find((x) => x.id === id);
    if (!c) return;
    const value = c.fn(); // the real closure runs
    setCounters((cs) => cs.map((x) => (x.id === id ? { ...x, count: value, calls: x.calls + 1 } : x)));
    setLog((l) => [...l, `${c.name}() → ${value}`]);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2>{s.title}</h2>
      </div>
      <div className="panel-body">
        <p className="lab-explain">{s.sub}</p>

        <div className="code-block">
          <HighlightedCode code={CODE} />
        </div>

        <div className="lab-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={createCounter}>
            {s.create}
          </button>
          {counters.map((c) => (
            <button
              key={c.id}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => callCounter(c.id)}
              aria-label={s.call.replace("{name}", c.name)}
            >
              {s.call.replace("{name}", c.name)}
            </button>
          ))}
        </div>

        <div className="lab-stage" aria-live="polite">
          <strong>
            {t("labs.memory")}: {s.counters}
          </strong>
          {counters.length === 0 && (
            <p className="lab-explain" style={{ marginTop: "0.4rem" }}>
              —
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            {counters.map((c) => (
              <div
                key={c.id}
                className="anim-in"
                style={{
                  border: "1px solid var(--accent)",
                  borderRadius: "0.75rem",
                  padding: "0.7rem 0.9rem",
                  background: "var(--surface-1)",
                  minWidth: "12rem",
                  flex: "1 1 12rem",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span style={{ color: "var(--accent)" }}>ƒ</span> {c.name}
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}> ({s.calls}: {c.calls})</span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    letterSpacing: "0.06em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.birthScope} →
                </div>
                <div
                  className={c.calls > 0 ? "anim-pulse" : undefined}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "var(--font-mono)",
                    padding: "0.35rem 0.6rem",
                    borderRadius: "0.5rem",
                    background: "var(--accent-dim)",
                    border: "1px dashed var(--accent)",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {s.closedCell}: count
                  </span>
                  <strong style={{ fontSize: "1.15rem" }}>{c.count}</strong>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <strong>{s.consoleOut}:</strong>
            <div className="console" role="log" aria-live="polite" style={{ marginTop: "0.4rem" }}>
              <div className="console-body">
                {log.length === 0 ? (
                  <div className="console-empty">{t("labs.noOutput")}</div>
                ) : (
                  log.map((line, i) => (
                    <div key={i} className="console-line anim-in">
                      <span className="lvl lvl-log">LOG</span>
                      <code style={{ fontFamily: "var(--font-mono)" }}>{line}</code>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="callout" style={{ marginTop: "0.75rem" }}>
          <strong>{s.explainTitle}</strong>
          <p className="lab-explain">{s.explain}</p>
          <p className="lab-explain">{s.explain2}</p>
        </div>
      </div>
    </div>
  );
}
