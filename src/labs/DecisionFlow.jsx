import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/**
 * DecisionFlow — if/else visualizer with an age slider.
 * Drag the slider: the decision path lights up live.
 */

const STRINGS = {
  en: {
    title: "DecisionFlow",
    sub: "Drag the slider. Watch the conditions evaluate one by one and the taken branch glow.",
    age: "age",
    output: "Output",
    branchLabels: ["Child", "Teen", "Adult", "Senior"],
    trueLabel: "TRUE",
    falseLabel: "FALSE",
    notReached: "skipped",
    codeTemplate: (age) =>
      `const age = ${age}; // ← drag the slider!\nif (age < 13) {\n  console.log("Child");\n} else if (age < 18) {\n  console.log("Teen");\n} else if (age < 65) {\n  console.log("Adult");\n} else {\n  console.log("Senior");\n}`,
  },
  es: {
    title: "DecisionFlow",
    sub: "Arrastra el deslizador. Observa cómo se evalúan las condiciones una a una y cómo brilla la rama elegida.",
    age: "edad",
    output: "Salida",
    branchLabels: ["Niño/a", "Adolescente", "Adulto/a", "Senior"],
    trueLabel: "VERDADERO",
    falseLabel: "FALSO",
    notReached: "omitida",
    codeTemplate: (age) =>
      `const age = ${age}; // ← ¡mueve el deslizador!\nif (age < 13) {\n  console.log("Child");\n} else if (age < 18) {\n  console.log("Teen");\n} else if (age < 65) {\n  console.log("Adult");\n} else {\n  console.log("Senior");\n}`,
  },
};

const BRANCHES = [
  { cond: (age) => age < 13, condText: "age < 13", branch: 0 },
  { cond: (age) => age < 18, condText: "age < 18", branch: 1 },
  { cond: (age) => age < 65, condText: "age < 65", branch: 2 },
  { cond: null, condText: "else", branch: 3 },
];

export default function DecisionFlow() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [age, setAge] = useState(20);

  // Evaluate the chain: the first true condition wins.
  // For each condition: its result, or null if it was never evaluated.
  const evaluated = [];
  let taken = 3;
  BRANCHES.forEach((b, i) => {
    if (b.cond === null || i >= taken) {
      evaluated.push(null);
    } else {
      const ok = b.cond(age);
      evaluated.push(ok);
      if (ok) taken = i;
    }
  });

  const output = s.branchLabels[taken];

  const diamondStyle = (active, ok) => ({
    width: "7.5rem",
    height: "7.5rem",
    transform: "rotate(45deg)",
    borderRadius: "0.6rem",
    border: `2px solid ${ok === true ? "var(--green)" : ok === false ? "var(--red)" : "var(--border)"}`,
    background: ok === true ? "var(--green-dim)" : ok === false ? "var(--red-dim)" : "var(--surface-1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: ok === true ? "0 0 1.25rem var(--green-dim)" : "none",
    opacity: active ? 1 : 0.55,
  });

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2>{s.title}</h2>
      </div>
      <div className="panel-body">
        <p className="lab-explain">{s.sub}</p>

        <div className="code-block">
          <HighlightedCode code={s.codeTemplate(age)} />
        </div>

        <div style={{ margin: "1rem 0" }}>
          <label htmlFor="age-slider" style={{ fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
            {s.age}: <code style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}>{age}</code>
          </label>
          <input
            id="age-slider"
            type="range"
            min="0"
            max="100"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }}
          />
        </div>

        <div className="lab-stage" aria-live="polite">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {BRANCHES.map((b, i) => {
              const ok = evaluated[i];
              const isTaken = taken === i;
              const active = ok !== null || (b.cond === null && isTaken);
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={diamondStyle(active, b.cond === null ? (isTaken ? true : null) : ok)}>
                    <span style={{ transform: "rotate(-45deg)", textAlign: "center" }}>
                      <code style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{b.condText}</code>
                      {b.cond !== null && ok !== null && (
                        <div
                          className="badge"
                          style={{
                            display: "block",
                            marginTop: "0.25rem",
                            borderColor: ok ? "var(--green)" : "var(--red)",
                            color: ok ? "var(--green)" : "var(--red)",
                          }}
                        >
                          {ok ? s.trueLabel : s.falseLabel}
                        </div>
                      )}
                    </span>
                  </div>
                  <div
                    className={isTaken ? "anim-pulse" : undefined}
                    style={{
                      marginTop: "0.4rem",
                      padding: "0.35rem 1rem",
                      borderRadius: "999px",
                      border: `2px solid ${isTaken ? "var(--green)" : "var(--border)"}`,
                      background: isTaken ? "var(--green-dim)" : "var(--surface-1)",
                      fontWeight: 700,
                      opacity: isTaken ? 1 : ok === null && b.cond !== null ? 0.45 : 0.75,
                      boxShadow: isTaken ? "0 0 1.25rem var(--green-dim)" : "none",
                    }}
                  >
                    {s.branchLabels[b.branch]}
                    {b.cond !== null && ok === null && !isTaken && (
                      <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)" }}>
                        {" "}
                        · {s.notReached}
                      </span>
                    )}
                  </div>
                  {i < BRANCHES.length - 1 && (
                    <div
                      aria-hidden="true"
                      style={{
                        width: "2px",
                        height: "1.1rem",
                        background: "var(--border)",
                        margin: "0.15rem 0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="callout" style={{ marginTop: "1rem" }} aria-live="polite">
            <strong>{s.output}:</strong>{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>{`"${output}"`}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
