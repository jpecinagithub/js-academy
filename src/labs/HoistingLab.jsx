import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Hoisting Lab",
    intro:
      "Step through the two phases of JavaScript execution. First the creation phase registers declarations in memory, then the execution phase runs the code line by line.",
    creationPhase: "Phase 1 — Creation",
    executionPhase: "Phase 2 — Execution",
    memory: "Memory",
    output: "Output",
    noteTitle: "Important",
    note:
      "Hoisting does NOT physically move your code. Before running a single line, JavaScript scans the scope and registers every declaration in memory — that is all hoisting is.",
    varTitle: "var — hoisted AND initialized",
    letTitle: "let — hoisted but NOT initialized",
    varSteps: [
      "Creation phase: the declaration `var a` is registered in memory and initialized with undefined.",
      "Execution, line 1: console.log(a) reads the slot → undefined is printed.",
      "Execution, line 2: `var a = 10` assigns 10 to the existing slot. Done — no error.",
    ],
    letSteps: [
      "Creation phase: the declaration `let b` is registered in memory but NOT initialized — it sits in the temporal dead zone (⛔ TDZ).",
      "Execution, line 1: console.log(b) touches the slot while it is still in the TDZ → ReferenceError: Cannot access 'b' before initialization. Execution stops here.",
    ],
    tdz: "⛔ TDZ — declared, not initialized",
    slotVar: "var slot",
    slotLet: "let slot",
    finishedVar: "Finished: a = 10, no errors.",
    finishedLet: "Stopped on the error above — line 2 never runs.",
    errorLet: "ReferenceError: Cannot access 'b' before initialization.",
  },
  es: {
    title: "Laboratorio de hoisting",
    intro:
      "Avanza por las dos fases de la ejecución de JavaScript. Primero la fase de creación registra las declaraciones en memoria, luego la fase de ejecución corre el código línea a línea.",
    creationPhase: "Fase 1 — Creación",
    executionPhase: "Fase 2 — Ejecución",
    memory: "Memoria",
    output: "Salida",
    noteTitle: "Importante",
    note:
      "El hoisting NO mueve físicamente tu código. Antes de ejecutar una sola línea, JavaScript recorre el ámbito y registra cada declaración en memoria — eso es todo lo que es el hoisting.",
    varTitle: "var — elevado E inicializado",
    letTitle: "let — elevado pero NO inicializado",
    varSteps: [
      "Fase de creación: la declaración `var a` se registra en memoria y se inicializa con undefined.",
      "Ejecución, línea 1: console.log(a) lee el hueco → se imprime undefined.",
      "Ejecución, línea 2: `var a = 10` asigna 10 al hueco existente. Listo — sin errores.",
    ],
    letSteps: [
      "Fase de creación: la declaración `let b` se registra en memoria pero NO se inicializa — queda en la zona muerta temporal (⛔ TDZ).",
      "Ejecución, línea 1: console.log(b) toca el hueco mientras sigue en la TDZ → ReferenceError: Cannot access 'b' before initialization. La ejecución se detiene aquí.",
    ],
    tdz: "⛔ TDZ — declarada, no inicializada",
    slotVar: "hueco var",
    slotLet: "hueco let",
    finishedVar: "Terminado: a = 10, sin errores.",
    finishedLet: "Detenido por el error de arriba — la línea 2 nunca se ejecuta.",
    errorLet: "ReferenceError: Cannot access 'b' before initialization.",
  },
};

const VAR_CODE = "console.log(a);\nvar a = 10;";
const LET_CODE = "console.log(b);\nlet b = 10;";

function PhasePanel({ title, code, steps, kind }) {
  const { t, lang } = useI18n();
  const s = STRINGS[lang];
  // step: 0 = idle, 1..steps.length = step done, beyond = finished
  const [step, setStep] = useState(0);

  const reset = () => setStep(0);
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));

  const isVar = kind === "var";
  const done = step >= steps.length;
  const inCreation = step >= 1;
  const inExecution = step >= 2;
  const errored = !isVar && step >= 2;
  const finishedOk = isVar && step >= 3;

  // Current line highlight: step 2 -> line 1, step 3 -> line 2
  const hlLine = step === 2 ? [1] : step === 3 ? [2] : [];

  const slotValue = !inCreation
    ? "—"
    : isVar
      ? step === 1
        ? "undefined"
        : "10"
      : s.tdz;

  return (
    <div className="panel" style={{ margin: 0 }}>
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {title}
      </div>
      <div className="panel-body">
        <div className="code-block">
          <pre>
            <HighlightedCode code={code} highlightLines={hlLine} />
          </pre>
        </div>

        <div className="lab-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={advance} disabled={done}>
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t("labs.reset")}
          </button>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }} aria-live="polite">
            {step === 0 ? "—" : step === 1 ? s.creationPhase : s.executionPhase}
          </span>
        </div>

        <h4 style={{ fontSize: "0.85rem", margin: "12px 0 4px" }}>{s.memory}</h4>
        <table className="data-table" aria-live="polite">
          <thead>
            <tr>
              <th>{isVar ? s.slotVar : s.slotLet}</th>
              <th>{s.output}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{isVar ? "a" : "b"}</code>
              </td>
              <td
                style={
                  !isVar && inCreation
                    ? { color: "var(--danger, #e5484d)", fontWeight: 700 }
                    : { fontFamily: "var(--font-mono)" }
                }
              >
                {slotValue}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ fontSize: "0.85rem", margin: "12px 0 4px" }}>{t("labs.console")}</h4>
        <div className="console" role="log" aria-live="polite" aria-label={t("labs.console")}>
          <div className="console-body">
            {isVar && inExecution && (
              <div className="console-line">
                <span className="lvl lvl-log">LOG</span>
                undefined
              </div>
            )}
            {errored && (
              <div className="console-line" style={{ color: "var(--danger, #e5484d)" }}>
                <span className="lvl lvl-error">ERROR</span>
                {s.errorLet}
              </div>
            )}
            {!inExecution && <div className="console-empty">{t("labs.noOutput")}</div>}
          </div>
        </div>

        <div className="lab-explain" aria-live="polite" style={{ minHeight: 64 }}>
          {step === 0 ? (
            <span style={{ color: "var(--muted)" }}>…</span>
          ) : (
            steps[step - 1]
          )}
        </div>

        {finishedOk && (
          <p className="anim-in" style={{ color: "var(--success, #3ddc97)", fontWeight: 600 }}>
            ✓ {s.finishedVar}
          </p>
        )}
        {errored && (
          <p className="anim-in" style={{ color: "var(--danger, #e5484d)", fontWeight: 600 }}>
            ✗ {s.finishedLet}
          </p>
        )}
      </div>
    </div>
  );
}

export default function HoistingLab() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>
        <div className="callout" style={{ marginBottom: 20 }}>
          <strong>{s.noteTitle}:</strong> {s.note}
        </div>
        <div className="grid-2" style={{ alignItems: "start" }}>
          <PhasePanel title={s.varTitle} code={VAR_CODE} steps={s.varSteps} kind="var" />
          <PhasePanel title={s.letTitle} code={LET_CODE} steps={s.letSteps} kind="let" />
        </div>
      </div>
    </div>
  );
}
