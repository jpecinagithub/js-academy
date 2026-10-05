import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";
import { Console } from "../components/Console.jsx";

const STRINGS = {
  en: {
    title: "Call Stack Visualizer",
    intro:
      "Watch the call stack grow and shrink as functions call each other. Frames push when a function is called and pop when it returns.",
    stackTitle: "Call stack (bottom → top)",
    removed: (name) => `${name} ← removed`,
    done: "Program finished — the stack is empty.",
    explains: [
      "The program starts: the global execution context is pushed onto the stack.",
      "one() is called on line 10 → pushed onto the stack.",
      "two() is called on line 8 → pushed onto the stack.",
      "three() is called on line 5 → pushed onto the stack.",
      'console.log("Hello") runs on line 2 → "Hello" is printed to the console.',
      "three() finished → popped off the stack (removed). Control returns to two().",
      "two() finished → popped off the stack. Control returns to one().",
      "one() finished → popped off the stack. Control returns to the global context.",
      "The global context finished → popped. The program is done and the stack is empty.",
    ],
  },
  es: {
    title: "Visualizador de la pila de llamadas",
    intro:
      "Observa cómo la pila de llamadas crece y se encoge cuando las funciones se llaman entre sí. Los marcos se apilan al llamar a una función y se retiran al terminar.",
    stackTitle: "Pila de llamadas (abajo → arriba)",
    removed: (name) => `${name} ← retirado`,
    done: "Programa terminado — la pila está vacía.",
    explains: [
      "El programa arranca: el contexto de ejecución global se apila.",
      "Se llama a one() en la línea 10 → se apila.",
      "Se llama a two() en la línea 8 → se apila.",
      "Se llama a three() en la línea 5 → se apila.",
      'console.log("Hello") se ejecuta en la línea 2 → se imprime "Hello" en la consola.',
      "three() terminó → se retira de la pila. El control vuelve a two().",
      "two() terminó → se retira de la pila. El control vuelve a one().",
      "one() terminó → se retira de la pila. El control vuelve al contexto global.",
      "El contexto global terminó → se retira. El programa acabó y la pila está vacía.",
    ],
  },
};

const CODE = `function three() {
  console.log("Hello");
}
function two() {
  three();
}
function one() {
  two();
}
one();`;

/* frames listed bottom → top */
const STEPS = [
  { frames: ["global()"], line: 10, removed: null, logged: false },
  { frames: ["global()", "one()"], line: 8, removed: null, logged: false },
  { frames: ["global()", "one()", "two()"], line: 5, removed: null, logged: false },
  { frames: ["global()", "one()", "two()", "three()"], line: 2, removed: null, logged: false },
  { frames: ["global()", "one()", "two()", "three()"], line: 2, removed: null, logged: true },
  { frames: ["global()", "one()", "two()"], line: 5, removed: "three()", logged: true },
  { frames: ["global()", "one()"], line: 8, removed: "two()", logged: true },
  { frames: ["global()"], line: 10, removed: "one()", logged: true },
  { frames: [], line: null, removed: "global()", logged: true },
];

const BASE_MS = 1400;

export default function CallStackVisualizer() {
  const { t, lang } = useI18n();
  const s = STRINGS[lang];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef(null);

  const last = STEPS.length - 1;
  const current = STEPS[step];
  const done = step === last;

  useEffect(() => {
    if (playing && !done) {
      timer.current = setInterval(() => {
        setStep((v) => {
          if (v >= last) {
            setPlaying(false);
            return v;
          }
          return v + 1;
        });
      }, BASE_MS / speed);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [playing, speed, done, last]);

  const doStep = () => {
    setPlaying(false);
    setStep((v) => Math.min(v + 1, last));
  };
  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  const consoleLines = current.logged ? [{ level: "log", text: "Hello" }] : [];

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="lab-controls">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setPlaying((p) => !p)}
            disabled={done}
            aria-pressed={playing}
          >
            {playing ? t("labs.pause") : t("labs.play")}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={doStep} disabled={done}>
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t("labs.reset")}
          </button>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{t("labs.speed")}:</span>
          {[0.5, 1, 2].map((v) => (
            <button
              key={v}
              type="button"
              className={`btn btn-sm ${speed === v ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => setSpeed(v)}
              aria-pressed={speed === v}
            >
              {v}x
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{t("labs.code")}</h3>
            <div className="code-block">
              <pre>
                <HighlightedCode code={CODE} highlightLines={current.line ? [current.line] : []} />
              </pre>
            </div>
            <h3 style={{ fontSize: "0.9rem" }}>{t("labs.console")}</h3>
            <Console lines={consoleLines} />
          </div>

          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{t("labs.callStack")}</h3>
            <div className="lab-stage" aria-live="polite">
              {current.removed && (
                <p key={`removed-${step}`} className="anim-in" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {s.removed(current.removed)}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: 8,
                  minHeight: 220,
                  justifyContent: "flex-start",
                }}
              >
                {current.frames.map((f, i) => {
                  const isTop = i === current.frames.length - 1;
                  return (
                    <div
                      key={`${step}-${f}`}
                      className="anim-in"
                      style={{
                        border: `2px solid ${isTop ? "var(--accent)" : "var(--diagram-line)"}`,
                        background: isTop ? "var(--accent-dim)" : "var(--surface-2)",
                        borderRadius: "var(--radius-m)",
                        padding: "10px 14px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: isTop ? 700 : 400,
                      }}
                    >
                      {f}
                    </div>
                  );
                })}
                {current.frames.length === 0 && (
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{s.done}</p>
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>{s.stackTitle}</p>
            </div>
          </div>
        </div>

        <div className="lab-explain" aria-live="polite">
          <strong>{t("labs.step")} {step + 1}/{STEPS.length}:</strong> {s.explains[step]}
        </div>
      </div>
    </div>
  );
}
