import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/**
 * ArrayLab — watch every element travel through the callback.
 * Scripted pedagogical simulator: results are computed with real JS
 * on the fixed array [3, 8, 12, 4, 20], one element per step.
 */

const DATA = [3, 8, 12, 4, 20];

const STRINGS = {
  en: {
    title: "ArrayLab",
    sub: "Watch every element travel through the callback, one step at a time.",
    method: "Method",
    callback: "Callback",
    source: "Source array",
    machine: "Inside the callback",
    result: "Result so far",
    finalResult: "Final result",
    kept: "kept",
    dropped: "dropped",
    noMatch: "no match",
    match: "match!",
    keepGoing: "false — keep going",
    stopNow: "false — STOP!",
    allPass: "true — keep going",
    earlyStop: "Early exit",
    accLabel: "acc",
    resultIs: "returns",
    explain: {
      map: "map transforms EVERY element with the callback and returns a new array of the same length.",
      filter:
        "filter keeps only the elements for which the callback returns true. The result can be shorter — or empty.",
      reduce:
        "reduce boils the whole array down to a single value, carrying an accumulator (acc) from one element to the next.",
      find: "find returns the FIRST element that passes the test, then stops looking.",
      some: "some asks: does AT LEAST ONE element pass the test? It stops at the first true.",
      every: "every asks: do ALL elements pass the test? It stops at the first false.",
    },
    hint: "Pick a method, then press Step or Run to feed the array through the callback element by element.",
  },
  es: {
    title: "ArrayLab",
    sub: "Observa cómo cada elemento viaja por el callback, un paso cada vez.",
    method: "Método",
    callback: "Callback",
    source: "Array original",
    machine: "Dentro del callback",
    result: "Resultado parcial",
    finalResult: "Resultado final",
    kept: "conservado",
    dropped: "descartado",
    noMatch: "sin coincidencia",
    match: "¡coincidencia!",
    keepGoing: "false — seguir",
    stopNow: "false — ¡PARAR!",
    allPass: "true — seguir",
    earlyStop: "Salida anticipada",
    accLabel: "acc",
    resultIs: "devuelve",
    explain: {
      map: "map transforma TODOS los elementos con el callback y devuelve un nuevo array de la misma longitud.",
      filter:
        "filter conserva solo los elementos para los que el callback devuelve true. El resultado puede ser más corto… o vacío.",
      reduce:
        "reduce reduce todo el array a un único valor, llevando un acumulador (acc) de un elemento al siguiente.",
      find: "find devuelve el PRIMER elemento que supera la prueba y deja de buscar.",
      some: "some pregunta: ¿AL MENOS UN elemento supera la prueba? Se detiene en el primer true.",
      every: "every pregunta: ¿TODOS los elementos superan la prueba? Se detiene en el primer false.",
    },
    hint: "Elige un método y pulsa Paso o Ejecutar para pasar el array por el callback elemento a elemento.",
  },
};

const METHODS = {
  map: { code: "x => x * 2", kind: "transform", fn: (x) => x * 2 },
  filter: { code: "x => x > 10", kind: "filter", fn: (x) => x > 10 },
  reduce: { code: "(acc, x) => acc + x", kind: "reduce", fn: (acc, x) => acc + x, init: 0 },
  find: { code: "x => x > 10", kind: "find", fn: (x) => x > 10 },
  some: { code: "x => x > 10", kind: "some", fn: (x) => x > 10 },
  every: { code: "x => x > 10", kind: "every", fn: (x) => x > 10 },
};

const METHOD_ORDER = ["map", "filter", "reduce", "find", "some", "every"];

function fmt(v) {
  return v === undefined ? "undefined" : JSON.stringify(v);
}

export default function ArrayLab() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];
  const [method, setMethod] = useState("map");
  const [idx, setIdx] = useState(0); // next element to process
  const [trace, setTrace] = useState([]); // processed entries
  const [done, setDone] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef(null);

  const M = METHODS[method];

  const reset = (nextMethod) => {
    if (nextMethod) setMethod(nextMethod);
    setIdx(0);
    setTrace([]);
    setDone(false);
    setAuto(false);
  };

  const step = () => {
    if (done || idx >= DATA.length) return;
    const x = DATA[idx];
    const entry = { i: idx, input: x };
    let stopAfter = false;

    if (M.kind === "transform") {
      entry.output = M.fn(x);
    } else if (M.kind === "filter") {
      entry.kept = !!M.fn(x);
    } else if (M.kind === "reduce") {
      const prev = trace.length === 0 ? M.init : trace[trace.length - 1].accAfter;
      entry.accBefore = prev;
      entry.accAfter = M.fn(prev, x);
    } else if (M.kind === "find") {
      entry.matched = !!M.fn(x);
      stopAfter = entry.matched;
    } else if (M.kind === "some") {
      entry.passed = !!M.fn(x);
      stopAfter = entry.passed;
    } else if (M.kind === "every") {
      entry.passed = !!M.fn(x);
      stopAfter = !entry.passed;
    }

    const next = [...trace, entry];
    setTrace(next);
    const nextIdx = idx + 1;
    if (stopAfter || nextIdx >= DATA.length) {
      setIdx(nextIdx);
      setDone(true);
      setAuto(false);
    } else {
      setIdx(nextIdx);
    }
  };

  // Auto-run stepping
  useEffect(() => {
    if (!auto) return undefined;
    timer.current = setInterval(step, 900);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, method, idx, trace, done]);

  useEffect(() => () => clearInterval(timer.current), []);

  const finalResult = (() => {
    if (!done) return null;
    if (M.kind === "transform") return trace.map((e) => e.output);
    if (M.kind === "filter") return trace.filter((e) => e.kept).map((e) => e.input);
    if (M.kind === "reduce") return trace.length ? trace[trace.length - 1].accAfter : M.init;
    if (M.kind === "find") {
      const hit = trace.find((e) => e.matched);
      return hit ? hit.input : undefined;
    }
    if (M.kind === "some") return trace.some((e) => e.passed);
    if (M.kind === "every") return trace.every((e) => e.passed);
    return null;
  })();

  const liveResult = (() => {
    if (M.kind === "transform") return trace.map((e) => e.output);
    if (M.kind === "filter") return trace.filter((e) => e.kept).map((e) => e.input);
    if (M.kind === "reduce") return trace.length ? [trace[trace.length - 1].accAfter] : [M.init];
    return null;
  })();

  const last = trace[trace.length - 1];

  const machineText = (e) => {
    if (!e) return null;
    if (M.kind === "transform") return `${e.input} → ${e.output}`;
    if (M.kind === "filter") return `${e.input} → ${e.kept ? `✓ ${s.kept}` : `✗ ${s.dropped}`}`;
    if (M.kind === "reduce") return `${s.accLabel}: ${e.accBefore} + ${e.input} → ${e.accAfter}`;
    if (M.kind === "find") return `${e.input} → ${e.matched ? `✓ ${s.match}` : s.noMatch}`;
    if (M.kind === "some") return `${e.input} → ${e.passed ? "true ✓" : s.keepGoing}`;
    if (M.kind === "every") return `${e.input} → ${e.passed ? s.allPass : s.stopNow}`;
    return "";
  };

  const isScalar = M.kind === "reduce" || M.kind === "some" || M.kind === "every" || M.kind === "find";

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2>{s.title}</h2>
      </div>
      <div className="panel-body">
        <p className="lab-explain">{s.sub}</p>

        <div className="lab-controls" role="group" aria-label={s.method}>
          {METHOD_ORDER.map((m) => (
            <button
              key={m}
              type="button"
              className={`btn btn-sm ${method === m ? "btn-primary" : "btn-secondary"}`}
              onClick={() => reset(m)}
              aria-pressed={method === m}
            >
              <code>.{m}()</code>
            </button>
          ))}
        </div>

        <div className="code-block" aria-label={s.callback}>
          <HighlightedCode code={`const result = [${DATA.join(", ")}].${method}(${M.code});`} />
        </div>

        <div className="lab-controls">
          <button type="button" className="btn btn-secondary btn-sm" onClick={step} disabled={done}>
            {t("labs.step")}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setAuto((a) => !a)}
            disabled={done}
          >
            {auto ? t("labs.pause") : t("labs.run")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => reset()}>
            {t("labs.reset")}
          </button>
        </div>

        <div className="lab-stage" aria-live="polite">
          <div style={{ marginBottom: "0.75rem" }}>
            <strong>{s.source}:</strong>
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
              {DATA.map((v, i) => {
                const isCurrent = i === idx && !done;
                const wasSeen = trace.some((e) => e.i === i);
                const style = {
                  minWidth: "2.2rem",
                  textAlign: "center",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)",
                  background: isCurrent ? "var(--accent-dim)" : wasSeen ? "var(--surface-2)" : "transparent",
                  borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  opacity: wasSeen || isCurrent ? 1 : 0.45,
                };
                return (
                  <span key={i} style={style} className={isCurrent ? "anim-pulse" : undefined}>
                    {v}
                  </span>
                );
              })}
            </div>
          </div>

          {last && !done && (
            <div key={`m-${idx}`} className="anim-in" style={{ marginBottom: "0.75rem" }}>
              <strong>{s.machine}:</strong>
              <div className="diagram" style={{ marginTop: "0.4rem", borderColor: "var(--accent)" }}>
                <code>{machineText(last)}</code>
              </div>
            </div>
          )}

          <div>
            <strong>{s.result}:</strong>{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>
              {liveResult ? `[${liveResult.map((v) => fmt(v)).join(", ")}]` : "—"}
            </code>
          </div>

          {done && (
            <div className="anim-in" style={{ marginTop: "0.75rem" }}>
              <div className="callout">
                <strong>{s.finalResult}:</strong>{" "}
                <code style={{ fontFamily: "var(--font-mono)" }}>
                  {isScalar ? fmt(finalResult) : `[${(finalResult || []).map((v) => fmt(v)).join(", ")}]`}
                </code>
                {trace.length < DATA.length && (
                  <span className="badge" style={{ marginLeft: "0.5rem" }}>
                    {s.earlyStop}
                  </span>
                )}
              </div>
              <p className="lab-explain">
                <strong>{s.resultIs}:</strong> {s.explain[method]}
              </p>
            </div>
          )}
        </div>

        {!done && trace.length === 0 && <p className="lab-explain">{s.hint}</p>}
      </div>
    </div>
  );
}
