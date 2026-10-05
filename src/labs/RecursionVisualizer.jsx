import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Recursion: factorial(5)",
    sub: "Watch the call stack grow as factorial calls itself, then shrink as the answers bubble back up.",
    expand: "Expand",
    resolve: "Resolve",
    stack: "Call stack",
    depth: "Stack depth",
    narration: "Narration",
    codeLabel: "The code",
    frames: "Frames",
    returned: "returned",
    waitingFor: "waiting…",
    base: "base case!",
    explainExpand:
      "Expand phase: every call to factorial(n) pauses and pushes a new frame for factorial(n − 1) on top of the stack. Nothing returns yet — the stack just grows.",
    explainResolve:
      "Resolve phase: factorial(1) hits the base case and returns 1. Each waiting frame then computes n × (result below it), returns upward, and pops off the stack.",
    note: "Without a base case the stack would grow forever — that's a stack overflow.",
  },
  es: {
    title: "Recursión: factorial(5)",
    sub: "Observa cómo la pila de llamadas crece mientras factorial se llama a sí mismo, y cómo se encoge cuando las respuestas vuelven hacia arriba.",
    expand: "Expansión",
    resolve: "Resolución",
    stack: "Pila de llamadas",
    depth: "Profundidad",
    narration: "Narración",
    codeLabel: "El código",
    frames: "Marcos (frames)",
    returned: "devuelto",
    waitingFor: "esperando…",
    base: "¡caso base!",
    explainExpand:
      "Fase de expansión: cada llamada a factorial(n) se pausa y apila un nuevo marco para factorial(n − 1) encima. Nada devuelve aún — la pila solo crece.",
    explainResolve:
      "Fase de resolución: factorial(1) alcanza el caso base y devuelve 1. Cada marco en espera calcula entonces n × (resultado de abajo), devuelve hacia arriba y se desapila.",
    note: "Sin un caso base la pila crecería para siempre — eso es un desbordamiento de pila (stack overflow).",
  },
};

const CODE = `function factorial(n) {
  if (n === 1) return 1;        // base case
  return n * factorial(n - 1);  // recursive case
}

factorial(5); // → 120`;

// Precomputed animation frames.
// { type: "call" | "return", n, stack: [..bottom..top], returns: {n: value} }
const FRAMES = (() => {
  const frames = [];
  for (let n = 5; n >= 1; n--) {
    const stack = [];
    for (let k = 5; k >= n; k--) stack.push(k);
    frames.push({ type: "call", n, stack, returns: {} });
  }
  const returns = { 1: 1 };
  frames.push({ type: "return", n: 1, stack: [5, 4, 3, 2, 1], returns: { ...returns } });
  let prev = 1;
  for (let n = 2; n <= 5; n++) {
    const val = n * prev;
    returns[n] = val;
    const stack = [];
    for (let k = 5; k >= n; k--) stack.push(k);
    frames.push({ type: "return", n, stack, returns: { ...returns }, prev, val });
    prev = val;
  }
  return frames;
})();

const NARR = {
  en: {
    call: (n) => `Calling factorial(${n}) — a new frame is pushed onto the stack. The caller waits.`,
    call1: () => `Calling factorial(1)…`,
    ret1: () => `factorial(1) hits the base case and returns 1. No more calls!`,
    ret: (n, prev, val) => `factorial(${n}) = ${n} × factorial(${n - 1}) = ${n} × ${prev} = ${val}. The frame pops; the value goes up to its caller.`,
  },
  es: {
    call: (n) => `Llamando a factorial(${n}) — se apila un nuevo marco en la pila. Quien llamó espera.`,
    call1: () => `Llamando a factorial(1)…`,
    ret1: () => `factorial(1) alcanza el caso base y devuelve 1. ¡No hay más llamadas!`,
    ret: (n, prev, val) => `factorial(${n}) = ${n} × factorial(${n - 1}) = ${n} × ${prev} = ${val}. El marco se desapila; el valor sube hacia quien llamó.`,
  },
};

export default function RecursionVisualizer() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];

  const [idx, setIdx] = useState(-1); // -1 = not started
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const stop = () => {
    clearInterval(timer.current);
    setPlaying(false);
  };

  const reset = () => {
    stop();
    setIdx(-1);
  };

  const step = () => {
    stop();
    setIdx((i) => Math.min(i + 1, FRAMES.length - 1));
  };

  const play = () => {
    if (idx >= FRAMES.length - 1) setIdx(-1);
    setPlaying(true);
    clearInterval(timer.current);
    const tick = () => {
      setIdx((i) => {
        if (i + 1 >= FRAMES.length) {
          clearInterval(timer.current);
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    };
    timer.current = setInterval(tick, 1400 / speed);
  };

  useEffect(() => {
    if (playing) {
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setIdx((i) => {
          if (i + 1 >= FRAMES.length) {
            clearInterval(timer.current);
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, 1400 / speed);
    }
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const frame = idx >= 0 ? FRAMES[idx] : null;

  const narration = (f) => {
    if (!f) return null;
    if (f.type === "call") return f.n === 1 ? NARR[lang].call1() : NARR[lang].call(f.n);
    if (f.n === 1) return NARR[lang].ret1();
    return NARR[lang].ret(f.n, f.prev, f.val);
  };

  const phase = frame ? frame.type : null;

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>

      <div className="lab-controls" role="group" aria-label={s.title}>
        {!playing ? (
          <button className="btn btn-primary" onClick={play} disabled={idx >= FRAMES.length - 1 && idx !== -1}>
            {idx === -1 ? t("labs.play") : t("labs.play")}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={stop}>
            {t("labs.pause")}
          </button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={step} disabled={playing || (idx >= FRAMES.length - 1 && idx !== -1)}>
          {t("labs.step")}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          {t("labs.reset")}
        </button>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--muted)" }}>
          {t("labs.speed")}
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label={t("labs.speed")}
            style={{ accentColor: "var(--accent)" }}
          />
          <span style={{ fontFamily: "var(--font-mono)" }}>{speed}×</span>
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }} aria-live="polite">
        <PhaseChip active={phase === "call"} color="var(--amber)" label={`1 · ${s.expand}`} done={idx >= 5} />
        <span style={{ color: "var(--faint)" }}>→</span>
        <PhaseChip active={phase === "return"} color="var(--accent)" label={`2 · ${s.resolve}`} done={false} />
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
          {idx < 0 ? `0 / ${FRAMES.length}` : `${idx + 1} / ${FRAMES.length}`}
        </span>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        {/* Call stack */}
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.stack}
            {frame && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                {s.depth}: {frame.stack.length}
              </span>
            )}
          </div>
          <div className="panel-body" aria-live="polite">
            {!frame && <p style={{ color: "var(--faint)" }}>{t("labs.noOutput")}</p>}
            {frame && (
              <>
                <DepthBars depth={frame.stack.length} max={5} />
                <div style={{ display: "flex", flexDirection: "column-reverse", gap: 6, marginTop: 12 }}>
                  {frame.stack.map((n) => {
                    const isTop = n === frame.n;
                    const returned = frame.returns[n] !== undefined && n !== frame.n;
                    return (
                      <div
                        key={n}
                        className={isTop ? "anim-pulse" : "anim-in"}
                        style={{
                          ...stackFrame,
                          borderColor: isTop ? "var(--amber)" : returned ? "var(--accent)" : "var(--border-strong)",
                          background: isTop ? "var(--amber-dim)" : returned ? "var(--accent-dim)" : "var(--surface-2)",
                        }}
                      >
                        <code style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          factorial({n})
                        </code>
                        <span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                          {n === 1 && frame.type === "return" ? s.base : frame.returns[n] !== undefined ? `→ ${frame.returns[n]}` : s.waitingFor}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Narration + code */}
        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" />
              {s.narration}
            </div>
            <div className="panel-body" aria-live="polite" style={{ minHeight: 88 }}>
              {frame ? (
                <p className="anim-in" style={{ margin: 0, color: "var(--text)", lineHeight: 1.6 }}>
                  {narration(frame)}
                </p>
              ) : (
                <p style={{ margin: 0, color: "var(--faint)" }}>{t("labs.noOutput")}</p>
              )}
            </div>
          </div>
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-head">
              <span className="lamp" />
              {s.codeLabel}
            </div>
            <div className="panel-body">
              <HighlightedCode code={CODE} />
            </div>
          </div>
        </div>
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <strong>{phase === "return" ? `2 · ${s.resolve}` : `1 · ${s.expand}`}</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
          {phase === "return" ? s.explainResolve : s.explainExpand}
        </p>
        <p style={{ margin: "8px 0 0", color: "var(--faint)", fontSize: 13, fontStyle: "italic" }}>{s.note}</p>
      </div>
    </div>
  );
}

function PhaseChip({ active, color, label, done }) {
  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 99,
        border: `2px solid ${active ? color : "var(--border)"}`,
        background: active ? `${color}18` : done ? "var(--accent-dim)" : "var(--surface-2)",
        color: active ? color : done ? "var(--accent)" : "var(--muted)",
        fontWeight: 700,
        fontSize: 13,
        transition: "all .3s var(--ease)",
      }}
    >
      {done && !active ? "✓ " : ""}
      {label}
    </span>
  );
}

function DepthBars({ depth, max }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 36 }} aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          style={{
            width: 26,
            height: `${((i + 1) / max) * 100}%`,
            borderRadius: 4,
            background: i < depth ? "var(--amber)" : "var(--surface-3)",
            opacity: i < depth ? 1 : 0.5,
            transition: "all .3s var(--ease)",
          }}
        />
      ))}
    </div>
  );
}

const stackFrame = {
  display: "flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "var(--radius-s)",
  border: "2px solid",
};
