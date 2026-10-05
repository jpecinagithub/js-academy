import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

// Flagship scripted pedagogical simulation of the JavaScript event loop.
// 15 precomputed steps (index 0..14) of a fixed example. Not a real debugger.
export default function EventLoopVisualizer() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang] ?? STRINGS.en;

  const LAST = STEPS.length - 1;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5 | 1 | 2

  // Auto-advance while playing; stops at the last step.
  useEffect(() => {
    if (!playing || step >= LAST) return;
    const id = setTimeout(() => {
      if (step + 1 >= LAST) setPlaying(false);
      setStep(Math.min(step + 1, LAST));
    }, SPEED_MS[speed]);
    return () => clearTimeout(id);
  }, [playing, step, speed, LAST]);

  const goStep = useCallback(
    (delta) => {
      setStep((p) => Math.min(Math.max(p + delta, 0), LAST));
    },
    [LAST]
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

  const cur = STEPS[step];
  const loopLabel =
    cur.loop === "check"
      ? s.loopCheck
      : cur.loop === "micro"
        ? s.loopMicro
        : cur.loop === "macro"
          ? s.loopMacro
          : s.loopIdle;

  return (
    <div>
      <p style={{ marginBottom: 4 }}>{s.subtitle}</p>

      {/* ---------- Controls ---------- */}
      <div className="lab-controls" role="group" aria-label={s.controlsLabel}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => goStep(-1)}
          disabled={step === 0}
          aria-label={s.stepBack}
        >
          ← {s.stepBack}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => goStep(1)}
          disabled={step === LAST}
        >
          {t("labs.step")} →
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => (step === LAST ? reset() : setPlaying((p) => !p))}
          aria-label={playing ? t("labs.pause") : t("labs.play")}
        >
          {playing ? `⏸ ${t("labs.pause")}` : `▶ ${t("labs.play")}`}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
          {t("labs.reset")}
        </button>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          role="group"
          aria-label={t("labs.speed")}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {t("labs.speed")}:
          </span>
          {[0.5, 1, 2].map((v) => (
            <button
              key={v}
              type="button"
              className={`btn btn-sm ${speed === v ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSpeed(v)}
              aria-pressed={speed === v}
            >
              {v}x
            </button>
          ))}
        </span>
      </div>

      <div className="grid-2">
        {/* ---------- Left column: code + explanation ---------- */}
        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" />
              {s.codeTitle}
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                }}
              >
                {s.stepOf(step, LAST)}
              </span>
            </div>
            <div className="panel-body">
              <div className="code-block">
                <pre>
                  <HighlightedCode
                    code={CODE}
                    highlightLines={cur.line >= 1 ? [cur.line] : []}
                  />
                </pre>
              </div>
            </div>
          </div>

          <div className="lab-explain" aria-live="polite">
            <strong>{s.stepOf(step, LAST)} · </strong>
            {cur.note[lang] ?? cur.note.en}
          </div>
        </div>

        {/* ---------- Right column: the machine ---------- */}
        <div>
          <div className="grid-2">
            <QueuePanel
              title={s.panelStack}
              items={cur.stack}
              emptyLabel={s.empty}
              pulse={false}
            />
            <QueuePanel
              title={s.panelWeb}
              items={cur.webApis}
              emptyLabel={s.empty}
              pulse={false}
            />
            <QueuePanel
              title={s.panelMicro}
              items={cur.micro}
              emptyLabel={s.empty}
              pulse={cur.loop === "micro"}
            />
            <QueuePanel
              title={s.panelMacro}
              items={cur.macro}
              emptyLabel={s.empty}
              pulse={cur.loop === "macro"}
            />
          </div>

          <div className={`panel ${cur.loop ? "anim-pulse" : ""}`}>
            <div className="panel-head">
              <span className="lamp" />
              {s.loopTitle}
            </div>
            <div className="panel-body" aria-live="polite">
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                {loopLabel}
              </span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="lamp" />
              {t("labs.console")}
            </div>
            <div className="console-body" aria-live="polite">
              {cur.out.length === 0 ? (
                <div className="console-empty">{s.noOutput}</div>
              ) : (
                cur.out.map((line, i) => (
                  <div
                    key={i}
                    className="console-line anim-in"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span style={{ color: "var(--accent)" }}>&gt; </span>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Final summary ---------- */}
      {step === LAST && (
        <div className="takeaway anim-in" aria-live="polite">
          <h3>{s.whyTitle}</h3>
          <ul>
            <li>{s.why1}</li>
            <li>{s.why2}</li>
            <li>{s.why3}</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            <strong>{s.orderLine}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function QueuePanel({ title, items, emptyLabel, pulse }) {
  return (
    <div className={`panel ${pulse ? "anim-pulse" : ""}`}>
      <div className="panel-head">
        <span className="lamp" />
        {title}
      </div>
      <div className="panel-body">
        {items.length === 0 ? (
          <span style={{ color: "var(--faint)", fontStyle: "italic" }}>
            {emptyLabel}
          </span>
        ) : (
          items.map((it, i) => (
            <div
              key={i}
              className="anim-in"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 10px",
                marginBottom: 6,
                wordBreak: "break-word",
              }}
            >
              {it}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const SPEED_MS = { 0.5: 1600, 1: 900, 2: 450 };

const CODE = `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`;

function S(line, stack, webApis, micro, macro, out, loop, en, es) {
  return { line, stack, webApis, micro, macro, out, loop, note: { en, es } };
}

const STEPS = [
  S(
    1,
    ["global()"],
    [],
    [],
    [],
    [],
    null,
    "The program starts: the global execution context is pushed onto the call stack.",
    "El programa arranca: el contexto de ejecución global se apila en la pila de llamadas."
  ),
  S(
    1,
    ['console.log("A")', "global()"],
    [],
    [],
    [],
    [],
    null,
    'A function call is pushed onto the stack: console.log("A") runs now.',
    'Se apila una llamada de función: console.log("A") se ejecuta ahora.'
  ),
  S(
    3,
    ["global()"],
    [],
    [],
    [],
    ["A"],
    null,
    '"A" prints to the console; console.log() returns and pops off the stack.',
    '"A" se imprime en la consola; console.log() retorna y sale de la pila.'
  ),
  S(
    3,
    ["setTimeout(cb, 0)", "global()"],
    [],
    [],
    [],
    ["A"],
    null,
    "setTimeout is a Web API — it is not part of JavaScript itself.",
    "setTimeout es una Web API: no forma parte de JavaScript en sí."
  ),
  S(
    7,
    ["global()"],
    ["⏱ timer(0ms) → cb B"],
    [],
    [],
    ["A"],
    null,
    "The timer is registered in the browser; setTimeout returns immediately, without waiting.",
    "El temporizador queda registrado en el navegador; setTimeout retorna al instante, sin esperar."
  ),
  S(
    7,
    ["global()"],
    [],
    [],
    ["cb B"],
    ["A"],
    null,
    "The timer fires (0 ms): its callback moves to the Task Queue — the macrotask queue.",
    "El temporizador se dispara (0 ms): su callback pasa a la Task Queue, la cola de macrotareas."
  ),
  S(
    7,
    ["Promise.then(cb)", "global()"],
    [],
    [],
    ["cb B"],
    ["A"],
    null,
    "Promise.resolve() is already fulfilled: calling .then(cb) on it…",
    "Promise.resolve() ya está cumplida: al llamar a .then(cb)…"
  ),
  S(
    11,
    ["global()"],
    [],
    ["cb C"],
    ["cb B"],
    ["A"],
    null,
    "…its callback goes to the Microtask Queue — the priority lane that outranks the Task Queue.",
    "…su callback va a la cola de microtareas: el carril prioritario, que tiene preferencia sobre la Task Queue."
  ),
  S(
    11,
    ['console.log("D")', "global()"],
    [],
    ["cb C"],
    ["cb B"],
    ["A"],
    null,
    'console.log("D") is pushed — synchronous code keeps running to the end.',
    'Se apila console.log("D"): el código síncrono sigue ejecutándose hasta el final.'
  ),
  S(
    11,
    ["global()"],
    [],
    ["cb C"],
    ["cb B"],
    ["A", "D"],
    null,
    '"D" prints. Synchronous code always finishes before any queued callback.',
    '"D" se imprime. El código síncrono siempre termina antes que cualquier callback en cola.'
  ),
  S(
    0,
    [],
    [],
    ["cb C"],
    ["cb B"],
    ["A", "D"],
    "check",
    "The stack is empty — the event loop wakes up. Microtasks always run before macrotasks. ALWAYS.",
    "La pila está vacía: el event loop despierta. Las microtareas siempre se ejecutan antes que las macrotareas. SIEMPRE."
  ),
  S(
    0,
    ["cb C"],
    [],
    [],
    ["cb B"],
    ["A", "D"],
    "micro",
    "The event loop takes the microtask (cb C) and pushes it onto the stack.",
    "El event loop toma la microtarea (cb C) y la apila en la pila."
  ),
  S(
    0,
    [],
    [],
    [],
    ["cb B"],
    ["A", "D", "C"],
    "check",
    '"C" prints. The Microtask Queue is drained — now the loop checks the Task Queue.',
    '"C" se imprime. La cola de microtareas queda vacía: ahora el loop revisa la Task Queue.'
  ),
  S(
    0,
    ["cb B"],
    [],
    [],
    [],
    ["A", "D", "C"],
    "macro",
    "The event loop takes the macrotask (cb B) and pushes it onto the stack.",
    "El event loop toma la macrotarea (cb B) y la apila en la pila."
  ),
  S(
    0,
    [],
    [],
    [],
    [],
    ["A", "D", "C", "B"],
    null,
    '"B" prints LAST — even with a 0 ms delay. Final order: A, D, C, B.',
    '"B" se imprime al FINAL, incluso con 0 ms de retardo. Orden final: A, D, C, B.'
  ),
];

const STRINGS = {
  en: {
    subtitle:
      "Why does setTimeout(..., 0) run last? Step through the call stack, the queues and the event loop as they decide the order — one step at a time.",
    codeTitle: "Code",
    controlsLabel: "Simulation controls",
    stepBack: "Back",
    stepOf: (x, last) => `Step ${x} / ${last}`,
    panelStack: "Call Stack",
    panelWeb: "Web APIs",
    panelMicro: "Microtask Queue",
    panelMacro: "Task Queue",
    empty: "— empty —",
    noOutput: "— no output yet —",
    loopTitle: "Event Loop",
    loopIdle: "💤 idle — the script is still running on the stack",
    loopCheck: "⚙️ checking — the stack is empty, looking for work…",
    loopMicro: "🔬 dispatched a microtask — from the Microtask Queue",
    loopMacro: "📦 dispatched a macrotask — from the Task Queue",
    whyTitle: "Why this order?",
    why1: "Synchronous code always runs first: A and D print before any queued callback.",
    why2: "Microtasks run before macrotasks — always. The promise callback (C) beats the timer callback (B).",
    why3: "setTimeout(..., 0) is still asynchronous: its callback waits in the Task Queue until the stack is empty and the Microtask Queue is drained.",
    orderLine: "Final order: A → D → C → B",
  },
  es: {
    subtitle:
      "¿Por qué setTimeout(..., 0) se ejecuta el último? Avanza paso a paso por la pila de llamadas, las colas y el event loop mientras deciden el orden.",
    codeTitle: "Código",
    controlsLabel: "Controles de la simulación",
    stepBack: "Atrás",
    stepOf: (x, last) => `Paso ${x} / ${last}`,
    panelStack: "Pila de llamadas",
    panelWeb: "Web APIs",
    panelMicro: "Cola de microtareas",
    panelMacro: "Cola de tareas",
    empty: "— vacía —",
    noOutput: "— sin salida aún —",
    loopTitle: "Event Loop",
    loopIdle: "💤 en reposo — el script sigue ejecutándose en la pila",
    loopCheck: "⚙️ comprobando — la pila está vacía, buscando trabajo…",
    loopMicro: "🔬 microtarea despachada — desde la cola de microtareas",
    loopMacro: "📦 macrotarea despachada — desde la cola de tareas",
    whyTitle: "¿Por qué este orden?",
    why1: "El código síncrono siempre se ejecuta primero: A y D se imprimen antes que cualquier callback en cola.",
    why2: "Las microtareas se ejecutan antes que las macrotareas — siempre. El callback de la promesa (C) gana al del temporizador (B).",
    why3: "setTimeout(..., 0) sigue siendo asíncrono: su callback espera en la cola de tareas hasta que la pila queda vacía y la cola de microtareas se drena.",
    orderLine: "Orden final: A → D → C → B",
  },
};
