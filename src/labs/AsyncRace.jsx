import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Promise Combinators Race",
    sub: "Three requests, four combinators. Who wins depends on which combinator you pick.",
    start: "Start race",
    reset: "Reset",
    reqA: "Request A",
    reqB: "Request B",
    reqC: "Request C",
    duration: "Duration",
    fails: "C fails",
    combinator: "Combinator",
    results: "Results",
    finishOrder: "Finish order",
    combinatorReturns: "What the combinator returned",
    ms: "ms",
    fulfilled: "fulfilled",
    rejected: "rejected",
    value: "value",
    reason: "reason",
    waiting: "Press “Start race” to run.",
    comboRace: "Promise.race",
    comboAll: "Promise.all",
    comboAllSettled: "Promise.allSettled",
    comboAny: "Promise.any",
    explainRace:
      "Promise.race settles as soon as the FIRST promise settles — fulfillment or rejection. Here it adopted the outcome of the fastest request.",
    explainAll:
      "Promise.all fulfills with an array of ALL values (in input order), but a single rejection rejects the whole thing immediately.",
    explainAllSettled:
      "Promise.allSettled waits for every promise and returns an array of status objects — { status: \"fulfilled\", value } or { status: \"rejected\", reason }. It never rejects.",
    explainAny:
      "Promise.any fulfills with the FIRST fulfillment, ignoring rejections — unless every promise rejects, in which case it throws an AggregateError.",
    comboHelp: {
      race: "First to settle wins — fulfillment OR rejection.",
      all: "All must fulfill; one rejection kills it.",
      allSettled: "Never rejects. Tells you the outcome of each.",
      any: "First fulfillment wins; rejections are ignored.",
    },
    codeLabel: "Equivalent code",
  },
  es: {
    title: "Carrera de combinadores de promesas",
    sub: "Tres peticiones, cuatro combinadores. Quién gana depende del combinador que elijas.",
    start: "Iniciar carrera",
    reset: "Reiniciar",
    reqA: "Petición A",
    reqB: "Petición B",
    reqC: "Petición C",
    duration: "Duración",
    fails: "C falla",
    combinator: "Combinador",
    results: "Resultados",
    finishOrder: "Orden de llegada",
    combinatorReturns: "Lo que devolvió el combinador",
    ms: "ms",
    fulfilled: "cumplida",
    rejected: "rechazada",
    value: "valor",
    reason: "motivo",
    waiting: "Pulsa «Iniciar carrera» para ejecutar.",
    comboRace: "Promise.race",
    comboAll: "Promise.all",
    comboAllSettled: "Promise.allSettled",
    comboAny: "Promise.any",
    explainRace:
      "Promise.race se resuelve en cuanto la PRIMERA promesa se resuelve — cumplimiento o rechazo. Aquí adoptó el resultado de la petición más rápida.",
    explainAll:
      "Promise.all se cumple con un array de TODOS los valores (en orden de entrada), pero un solo rechazo rechaza todo el conjunto de inmediato.",
    explainAllSettled:
      "Promise.allSettled espera a todas las promesas y devuelve un array de objetos de estado — { status: \"fulfilled\", value } o { status: \"rejected\", reason }. Nunca rechaza.",
    explainAny:
      "Promise.any se cumple con el PRIMER cumplimiento, ignorando los rechazos — salvo que todas rechacen, en cuyo caso lanza un AggregateError.",
    comboHelp: {
      race: "La primera en resolverse gana — cumplimiento O rechazo.",
      all: "Todas deben cumplirse; un rechazo lo tumba todo.",
      allSettled: "Nunca rechaza. Te cuenta el resultado de cada una.",
      any: "El primer cumplimiento gana; los rechazos se ignoran.",
    },
    codeLabel: "Código equivalente",
  },
};

const COMBOS = ["race", "all", "allSettled", "any"];
const TICK = 40;

export default function AsyncRace() {
  const { lang } = useI18n();
  const s = STRINGS[lang];

  const [durations, setDurations] = useState({ A: 1200, B: 400, C: 900 });
  const [cFails, setCFails] = useState(false);
  const [combo, setCombo] = useState("race");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [settled, setSettled] = useState({}); // id -> {ok, value|reason, at}
  const [finished, setFinished] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const reset = () => {
    clearInterval(timer.current);
    setRunning(false);
    setFinished(false);
    setElapsed(0);
    setSettled({});
  };

  const start = () => {
    reset();
    setRunning(true);
    const t0 = Date.now();
    const outcome = {}; // id -> {ok, value|reason, at}
    timer.current = setInterval(() => {
      const el = Date.now() - t0;
      setElapsed(el);
      ["A", "B", "C"].forEach((id) => {
        if (outcome[id]) return;
        if (el >= durations[id]) {
          const ok = !(id === "C" && cFails);
          outcome[id] = ok
            ? { ok: true, value: `Response ${id} (${durations[id]}ms)`, at: durations[id] }
            : { ok: false, reason: `NetworkError: C failed`, at: durations[id] };
          setSettled({ ...outcome });
        }
      });
      if (["A", "B", "C"].every((id) => outcome[id])) {
        clearInterval(timer.current);
        setRunning(false);
        setFinished(true);
      }
    }, TICK);
  };

  const order = ["A", "B", "C"]
    .filter((id) => settled[id])
    .sort((a, b) => settled[a].at - settled[b].at);

  // Compute what the selected combinator returns
  let result = null;
  if (finished) {
    const outcomes = ["A", "B", "C"].map((id) => settled[id]);
    if (combo === "race") {
      const w = outcomes.sort((a, b) => a.at - b.at)[0];
      result = w.ok ? { kind: "value", text: w.value } : { kind: "rejection", text: w.reason };
    } else if (combo === "all") {
      const bad = outcomes.find((o) => !o.ok);
      result = bad
        ? { kind: "rejection", text: bad.reason }
        : { kind: "value", text: `[ ${outcomes.map((o) => `"${o.value}"`).join(", ")} ]` };
    } else if (combo === "allSettled") {
      const parts = outcomes.map((o) =>
        o.ok ? `{ status: "fulfilled", value: "${o.value}" }` : `{ status: "rejected", reason: "${o.reason}" }`
      );
      result = { kind: "value", text: `[\n  ${parts.join(",\n  ")}\n]` };
    } else {
      const good = outcomes.sort((a, b) => a.at - b.at).find((o) => o.ok);
      result = good
        ? { kind: "value", text: good.value }
        : { kind: "rejection", text: "AggregateError: All promises were rejected" };
    }
  }

  const codeSnippet = {
    race: "Promise.race([reqA, reqB, reqC])",
    all: "Promise.all([reqA, reqB, reqC])",
    allSettled: "Promise.allSettled([reqA, reqB, reqC])",
    any: "Promise.any([reqA, reqB, reqC])",
  }[combo];

  const comboKey = { race: "comboRace", all: "comboAll", allSettled: "comboAllSettled", any: "comboAny" }[combo];

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>

      <div className="lab-controls" role="group" aria-label={s.title}>
        {!running && !finished && (
          <button className="btn btn-primary" onClick={start}>
            {s.start}
          </button>
        )}
        {(running || finished) && (
          <button className="btn btn-secondary" onClick={reset}>
            {s.reset}
          </button>
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={cFails} onChange={(e) => { setCFails(e.target.checked); reset(); }} disabled={running} />
          <code style={{ fontFamily: "var(--font-mono)" }}>{s.fails}</code>
        </label>
      </div>

      {/* Combinator selector */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <span className="lamp" />
          {s.combinator}
        </div>
        <div className="panel-body">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="radiogroup" aria-label={s.combinator}>
            {COMBOS.map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={combo === c}
                className={`btn btn-sm ${combo === c ? "btn-primary" : "btn-ghost"}`}
                onClick={() => { setCombo(c); reset(); }}
                disabled={running}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s[{ race: "comboRace", all: "comboAll", allSettled: "comboAllSettled", any: "comboAny" }[c]]}
              </button>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "10px 0 0" }}>{s.comboHelp[combo]}</p>
        </div>
      </div>

      {/* Racers */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <span className="lamp" />
          {s.title}
        </div>
        <div className="panel-body">
          {["A", "B", "C"].map((id) => {
            const dur = durations[id];
            const pct = settled[id] ? 100 : Math.min(100, (elapsed / dur) * 100);
            const st = settled[id];
            return (
              <div key={id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <code style={{ fontFamily: "var(--font-mono)", fontWeight: 800, minWidth: 24 }}>{id}</code>
                  <span style={{ color: "var(--muted)", fontSize: 13, flex: 1 }}>
                    {s.duration}: <strong style={{ fontFamily: "var(--font-mono)" }}>{dur}{s.ms}</strong>
                  </span>
                  {st && (
                    <span
                      className="anim-in"
                      style={{
                        fontSize: 12,
                        padding: "2px 10px",
                        borderRadius: 99,
                        background: st.ok ? "var(--accent-dim)" : "var(--red-dim)",
                        color: st.ok ? "var(--accent)" : "var(--red)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {st.ok ? s.fulfilled : s.rejected} @ {st.at}{s.ms}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input
                    type="range"
                    min={200}
                    max={2500}
                    step={50}
                    value={dur}
                    disabled={running || finished}
                    onChange={(e) => setDurations((d) => ({ ...d, [id]: Number(e.target.value) }))}
                    aria-label={`${s[{ A: "reqA", B: "reqB", C: "reqC" }[id]]} ${s.duration}`}
                    style={{ flex: "0 0 180px", accentColor: "var(--accent)" }}
                  />
                  <div style={{ flex: 1, height: 14, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: 99,
                        background: st
                          ? st.ok
                            ? "var(--accent)"
                            : "var(--red)"
                          : "var(--blue)",
                        transition: "width 60ms linear",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.results}
          </div>
          <div className="panel-body" aria-live="polite">
            {!finished && !running && <p style={{ color: "var(--faint)" }}>{s.waiting}</p>}
            {(running || finished) && order.length > 0 && (
              <>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--muted)" }}>{s.finishOrder}</h4>
                <ol style={{ margin: "0 0 16px", paddingLeft: 20, fontFamily: "var(--font-mono)", fontSize: 14 }}>
                  {order.map((id, i) => (
                    <li key={id} className="anim-in" style={{ color: settled[id].ok ? "var(--accent)" : "var(--red)" }}>
                      {id} — {settled[id].at}{s.ms} {i === 0 && "🏆"}
                    </li>
                  ))}
                </ol>
              </>
            )}
            {finished && result && (
              <>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--muted)" }}>
                  {s[comboKey]} → {s.combinatorReturns}
                </h4>
                <div
                  className="anim-in"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    whiteSpace: "pre-wrap",
                    padding: 12,
                    borderRadius: "var(--radius-s)",
                    background: result.kind === "value" ? "var(--accent-dim)" : "var(--red-dim)",
                    border: `1px solid ${result.kind === "value" ? "var(--accent)" : "var(--red)"}`,
                    color: "var(--text)",
                  }}
                >
                  {result.kind === "value" ? "✓ " : "✗ "}
                  {result.text}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" />
              {s.codeLabel}
            </div>
            <div className="panel-body">
              <HighlightedCode code={`${codeSnippet}\n  .then(console.log)\n  .catch(console.error);`} />
            </div>
          </div>
          {finished && (
            <div className="callout anim-in" style={{ marginTop: 16 }}>
              <strong>{s[{ race: "comboRace", all: "comboAll", allSettled: "comboAllSettled", any: "comboAny" }[combo]]}</strong>
              <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s[{ race: "explainRace", all: "explainAll", allSettled: "explainAllSettled", any: "explainAny" }[combo]]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
