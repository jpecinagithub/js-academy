import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";

const STRINGS = {
  en: {
    title: "Event Propagation: Capturing vs Bubbling",
    sub: "An event doesn't just hit the element you clicked — it travels. Click the button and watch the journey.",
    captureOn: "capture listeners",
    bubbleOn: "bubble listeners",
    stopAtButton: "stopPropagation() in button",
    clickMe: "Click me",
    start: "Dispatch click",
    step: "Step",
    reset: "Reset",
    eventLog: "Event log",
    capturing: "capturing",
    bubbling: "bubbling",
    phaseCapturing: "CAPTURING PHASE",
    phaseBubbling: "BUBBLING PHASE",
    phaseTarget: "AT TARGET",
    docNode: "document",
    sectionNode: "section.container",
    buttonNode: "button",
    stoppedNote: "stopPropagation() was called at the button — the bubbling phase never happens.",
    explainCapture:
      "Capturing phase: the event travels top-down, from document toward the target. Capture listeners (addEventListener('click', fn, true)) fire on this leg.",
    explainBubble:
      "Bubbling phase: the event travels bottom-up, from the target back to document. This is the default — most handlers you write run here.",
    explainStop:
      "stopPropagation() halts the journey immediately. Called at the button during capture, it prevents the bubbling phase entirely — but listeners on the button itself still run.",
    waiting: "Press “Dispatch click” or use Step to walk through the event path.",
    done: "Event finished dispatching.",
    legendCapture: "capturing hop",
    legendBubble: "bubbling hop",
  },
  es: {
    title: "Propagación de eventos: captura vs burbuja",
    sub: "Un evento no solo golpea el elemento que pulsaste — viaja. Pulsa el botón y observa el recorrido.",
    captureOn: "escuchas de captura (capture)",
    bubbleOn: "escuchas de burbuja (bubble)",
    stopAtButton: "stopPropagation() en el botón",
    clickMe: "Púlsame",
    start: "Disparar clic",
    step: "Paso",
    reset: "Reiniciar",
    eventLog: "Registro del evento",
    capturing: "captura",
    bubbling: "burbuja",
    phaseCapturing: "FASE DE CAPTURA",
    phaseBubbling: "FASE DE BURBUJA",
    phaseTarget: "EN EL OBJETIVO",
    docNode: "document",
    sectionNode: "section.container",
    buttonNode: "button",
    stoppedNote: "Se llamó a stopPropagation() en el botón — la fase de burbuja nunca ocurre.",
    explainCapture:
      "Fase de captura: el evento viaja de arriba abajo, desde document hasta el objetivo. Las escuchas de captura (addEventListener('click', fn, true)) se disparan en este tramo.",
    explainBubble:
      "Fase de burbuja: el evento viaja de abajo arriba, desde el objetivo de vuelta a document. Es el comportamiento por defecto — la mayoría de manejadores que escribes se ejecutan aquí.",
    explainStop:
      "stopPropagation() detiene el recorrido de inmediato. Llamado en el botón durante la captura, impide por completo la fase de burbuja — pero las escuchas del propio botón sí se ejecutan.",
    waiting: "Pulsa «Disparar clic» o usa Paso para recorrer el camino del evento.",
    done: "El evento terminó de propagarse.",
    legendCapture: "salto de captura",
    legendBubble: "salto de burbuja",
  },
};

export default function EventPropagation() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];

  const [captureOn, setCaptureOn] = useState(true);
  const [bubbleOn, setBubbleOn] = useState(true);
  const [stopAtButton, setStopAtButton] = useState(false);
  const [hops, setHops] = useState([]); // [{node, phase, isTarget}]
  const [hopIdx, setHopIdx] = useState(-1);
  const [log, setLog] = useState([]); // strings
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [stopped, setStopped] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const nodeLabel = { document: s.docNode, section: s.sectionNode, button: s.buttonNode };

  const buildHops = () => {
    const list = [];
    if (captureOn) {
      list.push({ node: "document", phase: "capturing", isTarget: false });
      list.push({ node: "section", phase: "capturing", isTarget: false });
      list.push({ node: "button", phase: "capturing", isTarget: true });
    }
    // stopPropagation called at the button (during capture) kills the bubble phase.
    const killed = stopAtButton && captureOn;
    if (bubbleOn && !killed) {
      list.push({ node: "button", phase: "bubbling", isTarget: true });
      list.push({ node: "section", phase: "bubbling", isTarget: false });
      list.push({ node: "document", phase: "bubbling", isTarget: false });
    }
    return { list, killed };
  };

  const reset = (keepToggles = true) => {
    clearInterval(timer.current);
    setPlaying(false);
    setHops([]);
    setHopIdx(-1);
    setLog([]);
    setDone(false);
    setStopped(false);
    if (!keepToggles) {
      setCaptureOn(true);
      setBubbleOn(true);
      setStopAtButton(false);
    }
  };

  const dispatch = () => {
    reset();
    const { list, killed } = buildHops();
    setHops(list);
    setStopped(false);
    if (list.length === 0) {
      setDone(true);
      return;
    }
    setPlaying(true);
    let i = 0;
    const tick = () => {
      const hop = list[i];
      setLog((l) => [...l, `${l.length + 1}. ${nodeLabel[hop.node]} — ${s[hop.phase]}`]);
      setHopIdx(i);
      i += 1;
      if (i >= list.length) {
        clearInterval(timer.current);
        setPlaying(false);
        setDone(true);
        setStopped(killed);
      }
    };
    tick();
    timer.current = setInterval(tick, 950);
  };

  const stepOnce = () => {
    clearInterval(timer.current);
    setPlaying(false);
    if (hops.length === 0) {
      const { list, killed } = buildHops();
      setHops(list);
      if (list.length === 0) {
        setDone(true);
        return;
      }
      const hop = list[0];
      setLog((l) => [...l, `1. ${nodeLabel[hop.node]} — ${s[hop.phase]}`]);
      setHopIdx(0);
      if (list.length === 1) {
        setDone(true);
        setStopped(killed);
      }
      return;
    }
    setHopIdx((prev) => {
      const next = prev + 1;
      if (next >= hops.length) {
        setDone(true);
        return prev;
      }
      const hop = hops[next];
      setLog((l) => [...l, `${l.length + 1}. ${nodeLabel[hop.node]} — ${s[hop.phase]}`]);
      if (next === hops.length - 1) {
        const { killed } = buildHops();
        setDone(true);
        setStopped(killed);
      }
      return next;
    });
  };

  const current = hopIdx >= 0 && hopIdx < hops.length ? hops[hopIdx] : null;
  const currentPhase = current ? current.phase : null;

  const boxStyle = (node) => {
    const isCurrent = current && current.node === node;
    const wasVisited = hops.slice(0, Math.max(0, hopIdx)).some((h) => h.node === node);
    let border = "2px solid var(--border-strong)";
    let shadow = "none";
    if (isCurrent) {
      const color = current.phase === "capturing" ? "var(--amber)" : "var(--blue)";
      border = `3px solid ${color}`;
      shadow = `0 0 20px ${color}55`;
    } else if (wasVisited) {
      border = "2px solid var(--accent)";
    }
    return { border, boxShadow: shadow };
  };

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>

      <div className="lab-controls" role="group" aria-label={s.title}>
        <button className="btn btn-primary" onClick={dispatch} disabled={playing}>
          {s.start}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={stepOnce} disabled={playing || done}>
          {t("labs.step")}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => reset(false)}>
          {t("labs.reset")}
        </button>
        <span style={{ display: "inline-flex", gap: 14, flexWrap: "wrap", marginLeft: 8 }}>
          {[
            [captureOn, setCaptureOn, s.captureOn],
            [bubbleOn, setBubbleOn, s.bubbleOn],
            [stopAtButton, setStopAtButton, s.stopAtButton],
          ].map(([v, set, label], i) => (
            <label key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
              <input type="checkbox" checked={v} onChange={(e) => { set(e.target.checked); reset(); }} disabled={playing} />
              <code style={{ fontFamily: "var(--font-mono)" }}>{label}</code>
            </label>
          ))}
        </span>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        {/* Nested real DOM */}
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.title}
          </div>
          <div className="panel-body">
            <div
              className={current?.node === "document" && currentPhase === "capturing" ? "anim-pulse" : ""}
              style={{ ...boxStyle("document"), borderRadius: "var(--radius-m)", padding: 18, transition: "all .3s var(--ease)" }}
            >
              <NodeTag label={nodeLabel.document} active={current?.node === "document"} phase={currentPhase} />
              <div
                className={current?.node === "section" ? "anim-pulse" : ""}
                style={{ ...boxStyle("section"), borderRadius: "var(--radius-m)", padding: 18, marginTop: 10, transition: "all .3s var(--ease)" }}
              >
                <NodeTag label={nodeLabel.section} active={current?.node === "section"} phase={currentPhase} />
                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <button
                    className={`btn btn-primary ${current?.node === "button" ? "anim-pulse" : ""}`}
                    style={{
                      ...boxStyle("button"),
                      fontSize: 17,
                      padding: "14px 34px",
                    }}
                    onClick={dispatch}
                    disabled={playing}
                    aria-label={s.clickMe}
                  >
                    {s.clickMe}
                  </button>
                  <div style={{ marginTop: 8 }}>
                    <NodeTag label={nodeLabel.button} active={current?.node === "button"} phase={currentPhase} inline />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 13, color: "var(--muted)" }} aria-live="polite">
              <span>
                <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "var(--amber)", marginRight: 6 }} />
                {s.legendCapture}
              </span>
              <span>
                <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "var(--blue)", marginRight: 6 }} />
                {s.legendBubble}
              </span>
              {currentPhase && (
                <strong style={{ color: currentPhase === "capturing" ? "var(--amber)" : "var(--blue)" }}>
                  {currentPhase === "capturing" ? s.phaseCapturing : s.phaseBubbling}
                </strong>
              )}
            </div>
          </div>
        </div>

        {/* Event log */}
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.eventLog}
          </div>
          <div className="panel-body" aria-live="polite">
            {log.length === 0 && <p style={{ color: "var(--faint)" }}>{s.waiting}</p>}
            {log.map((line, i) => (
              <div key={i} className="anim-in" style={logRow}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    color: line.includes(s.capturing) ? "var(--amber)" : "var(--blue)",
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
            {stopped && (
              <div className="callout anim-in" style={{ borderColor: "var(--red)", marginTop: 10 }}>
                <strong style={{ color: "var(--red)" }}>✋ stopPropagation()</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.stoppedNote}</p>
              </div>
            )}
            {done && log.length > 0 && !stopped && (
              <p className="anim-in" style={{ color: "var(--accent)", fontSize: 14, marginTop: 10 }}>
                ✓ {s.done}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="callout">
          <strong style={{ color: "var(--amber)" }}>⬇ {s.phaseCapturing}</strong>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.explainCapture}</p>
        </div>
        <div className="callout">
          <strong style={{ color: "var(--blue)" }}>⬆ {s.phaseBubbling}</strong>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.explainBubble}</p>
        </div>
      </div>
      {stopAtButton && (
        <div className="callout anim-in" style={{ marginTop: 16 }}>
          <strong>✋ stopPropagation()</strong>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.explainStop}</p>
        </div>
      )}
    </div>
  );
}

function NodeTag({ label, active, phase, inline }) {
  const color = active ? (phase === "capturing" ? "var(--amber)" : "var(--blue)") : "var(--faint)";
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color,
        fontWeight: active ? 800 : 400,
        display: inline ? "inline" : "block",
        marginBottom: inline ? 0 : 4,
      }}
    >
      {label}
    </code>
  );
}

const logRow = {
  padding: "6px 12px",
  borderRadius: "var(--radius-s)",
  background: "var(--surface-2)",
  marginBottom: 6,
};
