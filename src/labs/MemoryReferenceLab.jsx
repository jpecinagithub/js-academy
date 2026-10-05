import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/**
 * MemoryReferenceLab — stack vs heap.
 * Two scripted scenarios: primitives copy the VALUE, objects copy the REFERENCE.
 */

const STRINGS = {
  en: {
    title: "Memory & References",
    sub: "Step through the code and watch where each value really lives: the STACK or the HEAP.",
    primTitle: "Scenario 1 — Primitives",
    objTitle: "Scenario 2 — Objects",
    stack: "STACK",
    heap: "HEAP",
    takeawayTitle: "The takeaway",
    takeaway: "Primitives (numbers, strings, booleans…) copy the VALUE: each variable owns its data. Objects copy the REFERENCE: both variables point to the same place in memory, so changing it through one name changes it for the other.",
    noteCopy: "b = a copied the VALUE 5",
    notePtr: "b = a copied the POINTER — both point to 0x001",
    valueCopied: "value",
    refCopied: "reference",
  },
  es: {
    title: "Memoria y referencias",
    sub: "Avanza por el código y observa dónde vive realmente cada valor: la PILA o el MONTÍCULO (heap).",
    primTitle: "Escenario 1 — Primitivos",
    objTitle: "Escenario 2 — Objetos",
    stack: "PILA (STACK)",
    heap: "MONTÍCULO (HEAP)",
    takeawayTitle: "La lección",
    takeaway: "Los primitivos (números, cadenas, booleanos…) copian el VALOR: cada variable es dueña de sus datos. Los objetos copian la REFERENCIA: ambas variables apuntan al mismo lugar en memoria, así que cambiarlo a través de un nombre lo cambia también para el otro.",
    noteCopy: "b = a copió el VALOR 5",
    notePtr: "b = a copió el PUNTERO — ambos apuntan a 0x001",
    valueCopied: "valor",
    refCopied: "referencia",
  },
};

const PRIM_LINES = ["let a = 5;", "let b = a;", "b = 10;"];
const OBJ_LINES = ["const a = { value: 5 };", "const b = a;", "b.value = 10;"];

// scripted frames per scenario
const PRIM_FRAMES = [
  { stack: [["a", "5"]], note: null },
  { stack: [["a", "5"], ["b", "5"]], note: "copy" },
  { stack: [["a", "5"], ["b", "10"]], note: null },
];

const OBJ_FRAMES = [
  { stack: [["a", "→ 0x001"]], heap: [["0x001", "{ value: 5 }"]], note: null },
  { stack: [["a", "→ 0x001"], ["b", "→ 0x001"]], heap: [["0x001", "{ value: 5 }"]], note: "ptr" },
  { stack: [["a", "→ 0x001"], ["b", "→ 0x001"]], heap: [["0x001", "{ value: 10 }"]], note: null },
];

function Box({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.6rem 0.75rem",
        background: "var(--surface-1)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "var(--muted)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function VarRow({ name, value, highlight }) {
  return (
    <div
      className={highlight ? "anim-in" : undefined}
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        padding: "0.25rem 0.4rem",
        borderRadius: "0.4rem",
        background: highlight ? "var(--accent-dim)" : "transparent",
        border: highlight ? "1px solid var(--accent)" : "1px solid transparent",
        marginBottom: "0.25rem",
      }}
    >
      <span style={{ color: "var(--accent)", fontWeight: 700 }}>{name}</span>
      <span aria-hidden="true">→</span>
      <span>{value}</span>
    </div>
  );
}

function Scenario({ title, lines, frames, t }) {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [step, setStep] = useState(0); // index of next line to execute
  const frame = frames[step - 1];

  const runStep = () => setStep((v) => Math.min(v + 1, lines.length));
  const reset = () => setStep(0);

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2 style={{ fontSize: "1.05rem" }}>{title}</h2>
      </div>
      <div className="panel-body">
        <div className="code-block" aria-label={title}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={i === step - 1 ? "anim-in" : undefined}
              style={{
                fontFamily: "var(--font-mono)",
                padding: "0.2rem 0.5rem",
                borderRadius: "0.35rem",
                background: i === step - 1 ? "var(--accent-dim)" : i < step ? "transparent" : "transparent",
                opacity: i < step ? 1 : i === step ? 1 : 0.4,
                borderLeft: i === step - 1 ? "3px solid var(--accent)" : "3px solid transparent",
              }}
            >
              <span style={{ color: "var(--muted)", marginRight: "0.6rem" }}>{i + 1}</span>
              {line}
            </div>
          ))}
        </div>

        <div className="lab-controls">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={runStep}
            disabled={step >= lines.length}
          >
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t("labs.reset")}
          </button>
        </div>

        <div className="lab-stage" aria-live="polite">
          {frame ? (
            <>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <Box title={s.stack}>
                  {frame.stack.map(([name, value]) => (
                    <VarRow key={name} name={name} value={value} highlight={step > 0} />
                  ))}
                </Box>
                {frame.heap && (
                  <Box title={s.heap}>
                    {frame.heap.map(([addr, contents]) => (
                      <VarRow
                        key={addr}
                        name={addr}
                        value={contents}
                        highlight={step >= 3 && title === s.objTitle}
                      />
                    ))}
                  </Box>
                )}
              </div>
              {frame.note === "copy" && (
                <p className="lab-explain" style={{ marginTop: "0.5rem" }}>
                  <span className="badge">{s.valueCopied}</span> {s.noteCopy}
                </p>
              )}
              {frame.note === "ptr" && (
                <p className="lab-explain" style={{ marginTop: "0.5rem" }}>
                  <span className="badge">{s.refCopied}</span> {s.notePtr}
                </p>
              )}
            </>
          ) : (
            <p className="lab-explain">—</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MemoryReferenceLab() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];

  return (
    <div>
      <div className="panel" style={{ marginBottom: "1rem" }}>
        <div className="panel-head">
          <span className="lamp" aria-hidden="true" />
          <h2>{s.title}</h2>
        </div>
        <div className="panel-body">
          <p className="lab-explain">{s.sub}</p>
          <div className="code-block">
            <HighlightedCode code="// two tiny programs, two very different endings" />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <Scenario title={s.primTitle} lines={PRIM_LINES} frames={PRIM_FRAMES} t={t} />
        <Scenario title={s.objTitle} lines={OBJ_LINES} frames={OBJ_FRAMES} t={t} />
      </div>

      <div className="callout" style={{ marginTop: "1rem" }} aria-live="polite">
        <strong>
          {t("labs.memory")}: {s.takeawayTitle}.{" "}
        </strong>
        {s.takeaway}
      </div>
    </div>
  );
}
