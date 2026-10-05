import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/**
 * LoopVisualizer — for / while / for...of with transport controls.
 * Scripted simulator: each loop is precomputed as a frame list so the
 * user can play, pause, step and change speed freely.
 */

const STRINGS = {
  en: {
    title: "LoopVisualizer",
    sub: "Pick a loop type and drive it with the transport controls.",
    loopType: "Loop type",
    variables: "Variables",
    condition: "Condition",
    continue: "continue",
    exit: "exit",
    consoleOut: "Console",
    progress: "Progress",
    finished: "Loop finished ✓",
    initLabel: "initialization",
    bodyLabel: "loop body",
    updateLabel: "update",
    iterOf: "of",
    codes: {
      for: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}`,
      while: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}`,
      "for-of": `for (const fruit of ["🍎", "🍐", "🍊"]) {\n  console.log(fruit);\n}`,
    },
  },
  es: {
    title: "LoopVisualizer",
    sub: "Elige un tipo de bucle y contrólalo con los botones de transporte.",
    loopType: "Tipo de bucle",
    variables: "Variables",
    condition: "Condición",
    continue: "continúa",
    exit: "sale",
    consoleOut: "Consola",
    progress: "Progreso",
    finished: "Bucle terminado ✓",
    initLabel: "inicialización",
    bodyLabel: "cuerpo del bucle",
    updateLabel: "actualización",
    iterOf: "de",
    codes: {
      for: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}`,
      while: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}`,
      "for-of": `for (const fruit of ["🍎", "🍐", "🍊"]) {\n  console.log(fruit);\n}`,
    },
  },
};

const LOOP_TYPES = ["for", "while", "for-of"];

// Build the frame list for each loop. Frame: { phase, vars, cond, condOk, log, done }
function buildFrames(type) {
  const frames = [];
  if (type === "for") {
    frames.push({ phase: "init", vars: { i: 0 } });
    for (let i = 0; i < 5; i++) {
      frames.push({ phase: "cond", vars: { i }, cond: "i < 5", condOk: true });
      frames.push({ phase: "body", vars: { i }, log: String(i) });
      frames.push({ phase: "update", vars: { i: i + 1 }, note: "i++" });
    }
    frames.push({ phase: "cond", vars: { i: 5 }, cond: "i < 5", condOk: false });
    frames.push({ phase: "end", vars: { i: 5 }, done: true });
  } else if (type === "while") {
    frames.push({ phase: "init", vars: { i: 0 } });
    for (let i = 0; i < 5; i++) {
      frames.push({ phase: "cond", vars: { i }, cond: "i < 5", condOk: true });
      frames.push({ phase: "body", vars: { i }, log: String(i) });
      frames.push({ phase: "update", vars: { i: i + 1 }, note: "i++" });
    }
    frames.push({ phase: "cond", vars: { i: 5 }, cond: "i < 5", condOk: false });
    frames.push({ phase: "end", vars: { i: 5 }, done: true });
  } else {
    const fruits = ["🍎", "🍐", "🍊"];
    fruits.forEach((fruit) => {
      frames.push({ phase: "body", vars: { fruit }, log: fruit });
    });
    frames.push({ phase: "end", vars: {}, done: true });
  }
  return frames;
}

const PHASE_KEY = { init: "initLabel", body: "bodyLabel", update: "updateLabel" };

export default function LoopVisualizer() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];
  const [type, setType] = useState("for");
  const [pos, setPos] = useState(0); // current frame index
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef(null);

  const frames = buildFrames(type);
  const frame = frames[Math.min(pos, frames.length - 1)];
  const totalLogs = frames.filter((f) => f.log !== undefined).length;
  const logsSoFar = frames.slice(0, pos + 1).filter((f) => f.log !== undefined);

  const reset = (nextType) => {
    if (nextType) setType(nextType);
    setPos(0);
    setPlaying(false);
  };

  const step = () => {
    setPlaying(false);
    setPos((p) => Math.min(p + 1, frames.length - 1));
  };

  // Playback
  useEffect(() => {
    if (!playing) return undefined;
    const interval = Math.round(900 / speed);
    timer.current = setInterval(() => {
      setPos((p) => {
        if (p >= frames.length - 1) {
          setPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, interval);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, type]);

  useEffect(() => () => clearInterval(timer.current), []);

  const phaseLabel = frame.phase === "cond" ? s.condition : frame.phase === "end" ? s.finished : s[PHASE_KEY[frame.phase]];

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2>{s.title}</h2>
      </div>
      <div className="panel-body">
        <p className="lab-explain">{s.sub}</p>

        <div className="lab-controls" role="group" aria-label={s.loopType}>
          {LOOP_TYPES.map((lt) => (
            <button
              key={lt}
              type="button"
              className={`btn btn-sm ${type === lt ? "btn-primary" : "btn-secondary"}`}
              onClick={() => reset(lt)}
              aria-pressed={type === lt}
            >
              <code>{lt}</code>
            </button>
          ))}
        </div>

        <div className="code-block">
          <HighlightedCode code={s.codes[type]} />
        </div>

        <div className="lab-controls" aria-label="transport">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (pos >= frames.length - 1) setPos(0);
              setPlaying((p) => !p);
            }}
          >
            {playing ? t("labs.pause") : t("labs.play")}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={step} disabled={playing}>
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => reset()}>
            {t("labs.reset")}
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
            {t("labs.speed")}: <strong>{speed}×</strong>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: "8rem", accentColor: "var(--accent)" }}
              aria-label={t("labs.speed")}
            />
          </label>
        </div>

        <div className="lab-stage">
          <div className="grid-2">
            <div>
              <div style={{ marginBottom: "0.6rem" }}>
                <strong>
                  {t("labs.iteration")}: {logsSoFar.length} {s.iterOf} {totalLogs}
                </strong>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{phaseLabel}</div>
              </div>

              <div style={{ marginBottom: "0.6rem" }}>
                <strong>{s.variables}:</strong>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                  {Object.keys(frame.vars).length === 0 && <span style={{ color: "var(--muted)" }}>—</span>}
                  {Object.entries(frame.vars).map(([k, v]) => (
                    <span
                      key={k}
                      className="anim-in"
                      style={{
                        fontFamily: "var(--font-mono)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "0.5rem",
                        border: "1px solid var(--accent)",
                        background: "var(--accent-dim)",
                      }}
                    >
                      {k} = {v}
                    </span>
                  ))}
                </div>
              </div>

              {frame.cond && (
                <div style={{ marginBottom: "0.6rem" }} aria-live="polite">
                  <strong>{s.condition}:</strong>{" "}
                  <code style={{ fontFamily: "var(--font-mono)" }}>{frame.cond}</code>{" "}
                  <span
                    className="badge"
                    style={{
                      borderColor: frame.condOk ? "var(--green)" : "var(--red)",
                      color: frame.condOk ? "var(--green)" : "var(--red)",
                    }}
                  >
                    {frame.condOk ? `✓ ${s.continue}` : `✗ ${s.exit}`}
                  </span>
                </div>
              )}

              {frame.done && (
                <div className="callout anim-in">
                  <strong>{s.finished}</strong>
                </div>
              )}

              <div style={{ marginTop: "0.6rem" }}>
                <strong>{s.progress}:</strong>
                <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.4rem" }} aria-hidden="true">
                  {frames
                    .filter((f) => f.log !== undefined)
                    .map((f, i) => (
                      <span
                        key={i}
                        style={{
                          flex: 1,
                          height: "0.6rem",
                          borderRadius: "999px",
                          background: i < logsSoFar.length ? "var(--accent)" : "var(--surface-3, var(--border))",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div>
              <strong>{s.consoleOut}:</strong>
              <div
                className="console"
                role="log"
                aria-live="polite"
                aria-label={s.consoleOut}
                style={{ marginTop: "0.4rem" }}
              >
                <div className="console-body">
                  {logsSoFar.length === 0 ? (
                    <div className="console-empty">{t("labs.noOutput")}</div>
                  ) : (
                    logsSoFar.map((f, i) => (
                      <div key={i} className="console-line anim-in">
                        <span className="lvl lvl-log">LOG</span>
                        {f.log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
