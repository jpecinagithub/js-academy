import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "The Promise Lifecycle",
    sub: "Build a promise by hand and watch it move through its three states.",
    create: "Create promise",
    resolve: "Resolve(value)",
    reject: "Reject(reason)",
    resolveLabel: "Fulfillment value",
    rejectLabel: "Rejection reason",
    handlerThen: ".then",
    handlerCatch: ".catch",
    handlerFinally: ".finally",
    handlers: "Attached handlers",
    stateIdle: "No promise yet",
    statePending: "PENDING",
    stateFulfilled: "FULFILLED",
    stateRejected: "REJECTED",
    pendingNote: "Waiting… the executor has started but hasn't settled the promise.",
    fulfilledNote: "Settled with a value. Any .then handler runs with it.",
    rejectedNote: "Settled with a reason. Any .catch handler runs with it.",
    timeline: "Handler timeline",
    fired: "fired",
    noHandlers: "No handlers attached — settle the promise to see what happens.",
    unhandledTitle: "Unhandled promise rejection",
    unhandledBody:
      "The promise was rejected but no .catch() is attached. In real code this prints a warning and can crash Node.js processes. Always end promise chains with a catch or handle the error.",
    explainTitle: "What just happened",
    explainPending:
      "A promise starts PENDING: the asynchronous work has begun, but we don't know the outcome yet. Code after new Promise() keeps running — nothing waits.",
    explainFulfilled:
      "resolve(value) moves the promise to FULFILLED. The queued .then callbacks are scheduled as microtasks and run in attachment order; .finally always runs last.",
    explainRejected:
      "reject(reason) moves the promise to REJECTED. If a .catch is attached it handles the error; otherwise the rejection is unhandled.",
    codeLabel: "The code you're simulating",
    valuePlaceholder: '"done!"',
    reasonPlaceholder: '"boom"',
    seconds: "s",
    statesExplained: "The three states",
    stPendingTitle: "pending",
    stPendingBody: "Initial state. The async operation is still running. Handlers wait.",
    stFulfilledTitle: "fulfilled",
    stFulfilledBody: "The operation completed. .then handlers receive the value.",
    stRejectedTitle: "rejected",
    stRejectedBody: "The operation failed. .catch handlers receive the reason.",
    onceSettled: "A settled promise never changes state again.",
  },
  es: {
    title: "El ciclo de vida de una Promise",
    sub: "Construye una promesa a mano y observa cómo pasa por sus tres estados.",
    create: "Crear promesa",
    resolve: "Resolver(valor)",
    reject: "Rechazar(motivo)",
    resolveLabel: "Valor de cumplimiento",
    rejectLabel: "Motivo de rechazo",
    handlerThen: ".then",
    handlerCatch: ".catch",
    handlerFinally: ".finally",
    handlers: "Manejadores adjuntos",
    stateIdle: "Aún no hay promesa",
    statePending: "PENDIENTE",
    stateFulfilled: "CUMPLIDA",
    stateRejected: "RECHAZADA",
    pendingNote: "Esperando… el ejecutor empezó pero aún no ha resuelto la promesa.",
    fulfilledNote: "Resuelta con un valor. Los manejadores .then se ejecutan con él.",
    rejectedNote: "Resuelta con un motivo. Los manejadores .catch se ejecutan con él.",
    timeline: "Cronología de manejadores",
    fired: "ejecutado",
    noHandlers: "Sin manejadores adjuntos — haz que la promesa se resuelva para ver qué pasa.",
    unhandledTitle: "Rechazo de promesa no manejado",
    unhandledBody:
      "La promesa fue rechazada pero no hay ningún .catch() adjunto. En código real esto imprime una advertencia y puede tumbar procesos de Node.js. Termina siempre las cadenas de promesas con un catch o gestiona el error.",
    explainTitle: "Qué acaba de pasar",
    explainPending:
      "Una promesa empieza PENDIENTE: la operación asíncrona comenzó, pero aún no sabemos el resultado. El código después de new Promise() sigue ejecutándose — nada espera.",
    explainFulfilled:
      "resolve(valor) mueve la promesa a CUMPLIDA. Los callbacks .then encolados se programan como microtareas y se ejecutan en orden de adjunción; .finally siempre se ejecuta al final.",
    explainRejected:
      "reject(motivo) mueve la promesa a RECHAZADA. Si hay un .catch adjunto gestiona el error; si no, el rechazo queda sin manejar.",
    codeLabel: "El código que estás simulando",
    valuePlaceholder: '"¡listo!"',
    reasonPlaceholder: '"¡boom!"',
    seconds: "s",
    statesExplained: "Los tres estados",
    stPendingTitle: "pending",
    stPendingBody: "Estado inicial. La operación asíncrona sigue en curso. Los manejadores esperan.",
    stFulfilledTitle: "fulfilled",
    stFulfilledBody: "La operación terminó bien. Los manejadores .then reciben el valor.",
    stRejectedTitle: "rejected",
    stRejectedBody: "La operación falló. Los manejadores .catch reciben el motivo.",
    onceSettled: "Una promesa resuelta nunca vuelve a cambiar de estado.",
  },
};

const STATE_COLOR = {
  idle: "var(--faint)",
  pending: "var(--amber)",
  fulfilled: "var(--accent)",
  rejected: "var(--red)",
};

export default function PromiseLab() {
  const { lang } = useI18n();
  const s = STRINGS[lang];

  const [state, setState] = useState("idle"); // idle | pending | fulfilled | rejected
  const [elapsed, setElapsed] = useState(0);
  const [value, setValue] = useState('"done!"');
  const [reason, setReason] = useState('"boom"');
  const [useThen, setUseThen] = useState(true);
  const [useCatch, setUseCatch] = useState(true);
  const [useFinally, setUseFinally] = useState(true);
  const [timeline, setTimeline] = useState([]); // {handler, detail}
  const [settledOutcome, setSettledOutcome] = useState(null); // fulfilled | rejected
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Pending clock
  useEffect(() => {
    if (state !== "pending") return;
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 50);
    return () => clearInterval(id);
  }, [state]);

  const clearPendingTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const create = () => {
    clearPendingTimers();
    setState("pending");
    setElapsed(0);
    setTimeline([]);
    setSettledOutcome(null);
  };

  const settle = (outcome) => {
    if (state !== "pending") return;
    setState(outcome);
    setSettledOutcome(outcome);
    const entries = [];
    if (outcome === "fulfilled") {
      if (useThen) entries.push({ handler: ".then", detail: `onFulfilled(${value})` });
      if (useFinally) entries.push({ handler: ".finally", detail: "cleanup()" });
    } else {
      if (useCatch) entries.push({ handler: ".catch", detail: `onRejected(${reason})` });
      if (useFinally) entries.push({ handler: ".finally", detail: "cleanup()" });
    }
    setTimeline([]);
    entries.forEach((e, i) => {
      timers.current.push(setTimeout(() => setTimeline((t) => [...t, e]), 350 * (i + 1)));
    });
  };

  const codeSnippet = `const p = new Promise((resolve, reject) => {
  // ... async work ...
});
${useThen ? `p.then((v) => console.log("then:", v));\n` : ""}${useCatch ? `p.catch((e) => console.log("catch:", e));\n` : ""}${useFinally ? `p.finally(() => console.log("finally: cleanup"));` : ""}`;

  const showUnhandled = settledOutcome === "rejected" && !useCatch;

  const stateSteps = ["pending", "fulfilled", "rejected"];

  return (
    <div>
      <div className="lab-controls" role="group" aria-label={s.title}>
        {state !== "pending" && (
          <button className="btn btn-primary" onClick={create}>
            {s.create}
          </button>
        )}
        {state === "pending" && (
          <>
            <button className="btn btn-primary" onClick={() => settle("fulfilled")}>
              {s.resolve}
            </button>
            <button className="btn btn-secondary" onClick={() => settle("rejected")}>
              {s.reject}
            </button>
          </>
        )}
      </div>

      {/* State machine visualization */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <span className="lamp" />
          {s.title}
        </div>
        <div className="panel-body">
          <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>
          <div
            className="diagram"
            style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: 20 }}
            aria-live="polite"
          >
            {stateSteps.map((st, i) => {
              const active = state === st;
              return (
                <div key={st} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i > 0 && <span style={{ color: "var(--faint)", fontSize: 20 }}>→</span>}
                  <div
                    className={active ? "anim-pulse" : ""}
                    style={{
                      padding: "14px 22px",
                      borderRadius: "var(--radius-m)",
                      border: `2px solid ${active ? STATE_COLOR[st] : "var(--border)"}`,
                      background: active ? `${STATE_COLOR[st]}18` : "var(--surface-2)",
                      color: active ? STATE_COLOR[st] : "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 800,
                      letterSpacing: 1,
                      boxShadow: active ? `0 0 24px ${STATE_COLOR[st]}33` : "none",
                      transition: "all .35s var(--ease)",
                    }}
                  >
                    {s[`state${st[0].toUpperCase()}${st.slice(1)}`]}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", minHeight: 28, color: "var(--muted)" }} aria-live="polite">
            {state === "idle" && s.stateIdle}
            {state === "pending" && (
              <>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--amber)", fontWeight: 700 }}>
                  ⏳ {elapsed.toFixed(1)}{s.seconds}
                </span>{" "}
                — {s.pendingNote}
              </>
            )}
            {state === "fulfilled" && s.fulfilledNote}
            {state === "rejected" && s.rejectedNote}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        {/* Controls: values + handlers */}
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.handlers}
          </div>
          <div className="panel-body">
            <label style={{ display: "block", marginBottom: 10, color: "var(--muted)" }}>
              {s.resolveLabel}
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={s.valuePlaceholder}
                disabled={state !== "pending"}
                style={inputStyle}
                aria-label={s.resolveLabel}
              />
            </label>
            <label style={{ display: "block", marginBottom: 16, color: "var(--muted)" }}>
              {s.rejectLabel}
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={s.reasonPlaceholder}
                disabled={state !== "pending"}
                style={inputStyle}
                aria-label={s.rejectLabel}
              />
            </label>
            {[
              [useThen, setUseThen, s.handlerThen],
              [useCatch, setUseCatch, s.handlerCatch],
              [useFinally, setUseFinally, s.handlerFinally],
            ].map(([v, set, label], i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} disabled={state === "pending"} />
                <code style={{ fontFamily: "var(--font-mono)" }}>{label}</code>
              </label>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.timeline}
          </div>
          <div className="panel-body" aria-live="polite">
            {timeline.length === 0 && <p style={{ color: "var(--faint)" }}>{s.noHandlers}</p>}
            {timeline.map((e, i) => (
              <div key={i} className="anim-in" style={timelineRow}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: e.handler === ".catch" ? "var(--red)" : e.handler === ".finally" ? "var(--muted)" : "var(--accent)",
                  }}
                >
                  {e.handler}
                </span>
                <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{e.detail}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ {s.fired}
                </span>
              </div>
            ))}
            {showUnhandled && (
              <div className="callout anim-in" style={{ borderColor: "var(--red)", marginTop: 12 }}>
                <strong style={{ color: "var(--red)" }}>⚠ {s.unhandledTitle}</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.unhandledBody}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <span className="lamp" />
          {s.explainTitle}
        </div>
        <div className="panel-body" aria-live="polite">
          {state === "idle" && <p style={{ color: "var(--muted)" }}>{s.explainPending}</p>}
          {state === "pending" && <p style={{ color: "var(--muted)" }}>{s.explainPending}</p>}
          {state === "fulfilled" && <p style={{ color: "var(--muted)" }}>{s.explainFulfilled}</p>}
          {state === "rejected" && <p style={{ color: "var(--muted)" }}>{s.explainRejected}</p>}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.codeLabel}
          </div>
          <div className="panel-body">
            <HighlightedCode code={codeSnippet} />
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.statesExplained}
          </div>
          <div className="panel-body">
            {[
              ["var(--amber)", s.stPendingTitle, s.stPendingBody],
              ["var(--accent)", s.stFulfilledTitle, s.stFulfilledBody],
              ["var(--red)", s.stRejectedTitle, s.stRejectedBody],
            ].map(([c, title, body], i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                <code style={{ fontFamily: "var(--font-mono)", color: c, fontWeight: 700 }}>{title}</code>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 14 }}>{body}</p>
              </div>
            ))}
            <p style={{ color: "var(--faint)", fontSize: 13, marginTop: 12, fontStyle: "italic" }}>{s.onceSettled}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "8px 12px",
  borderRadius: "var(--radius-s)",
  border: "1px solid var(--border)",
  background: "var(--code-bg)",
  color: "var(--text)",
  fontFamily: "var(--font-mono)",
  fontSize: 14,
};

const timelineRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 12px",
  borderRadius: "var(--radius-s)",
  background: "var(--surface-2)",
  marginBottom: 8,
};
