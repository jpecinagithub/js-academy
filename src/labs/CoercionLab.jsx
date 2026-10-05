import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useSandbox } from "../runtime/useSandbox.js";

/**
 * CoercionLab — predict, then reveal.
 * The user guesses each expression's result; the lab RUNS the real
 * expression in the isolated sandbox and explains the coercion rule.
 */

const STRINGS = {
  en: {
    title: "CoercionLab",
    sub: "Predict the result of each expression, then click Reveal — the expression really runs in the sandbox.",
    expression: "Expression",
    prediction: "Your prediction",
    reveal: "Reveal",
    actual: "Actual",
    rule: "Why",
    score: "Score: {x} / {y} predicted correctly",
    placeholder: "e.g. 42, true, \"hello\"…",
    correct: "Correct ✓",
    wrong: "Not quite ✗",
    emptyString: '"" (empty string)',
    runOne: "Runs the expression in the sandbox",
  },
  es: {
    title: "CoercionLab",
    sub: "Predice el resultado de cada expresión y pulsa Revelar — la expresión se ejecuta de verdad en el sandbox.",
    expression: "Expresión",
    prediction: "Tu predicción",
    reveal: "Revelar",
    actual: "Real",
    rule: "Por qué",
    score: "Puntuación: {x} / {y} predicciones correctas",
    placeholder: "p. ej. 42, true, \"hola\"…",
    correct: "¡Correcto! ✓",
    wrong: "Casi… ✗",
    emptyString: '"" (cadena vacía)',
    runOne: "Ejecuta la expresión en el sandbox",
  },
};

// expr + the coercion rule behind it (bilingual)
const ROWS = [
  {
    expr: '"5" + 2',
    rule: {
      en: "The + operator prefers strings: if either side is a string, the other is converted to a string and they concatenate.",
      es: "El operador + prefiere cadenas: si un lado es una cadena, el otro se convierte a cadena y se concatenan.",
    },
  },
  {
    expr: '"5" - 2',
    rule: {
      en: "The - operator only does math, so both sides are converted to numbers: 5 - 2 = 3.",
      es: "El operador - solo hace matemáticas, así que ambos lados se convierten a números: 5 - 2 = 3.",
    },
  },
  {
    expr: "true + 1",
    rule: {
      en: "true converts to the number 1 when math is involved: 1 + 1 = 2.",
      es: "true se convierte al número 1 cuando hay matemáticas de por medio: 1 + 1 = 2.",
    },
  },
  {
    expr: "null == undefined",
    rule: {
      en: "Special rule of loose equality: null and undefined are only equal to each other (and to themselves).",
      es: "Regla especial de la igualdad débil: null y undefined solo son iguales entre sí (y consigo mismos).",
    },
  },
  {
    expr: "0 == false",
    rule: {
      en: "Loose == converts both sides to numbers: false becomes 0, and 0 == 0 is true.",
      es: "La igualdad débil == convierte ambos lados a números: false pasa a ser 0, y 0 == 0 es true.",
    },
  },
  {
    expr: "0 === false",
    rule: {
      en: "Strict === never converts: a number and a boolean are different types, so it's false.",
      es: "La igualdad estricta === nunca convierte: un número y un booleano son tipos distintos, así que es false.",
    },
  },
  {
    expr: "[] + []",
    rule: {
      en: "Both arrays become empty strings first ([] → \"\"), and + concatenates strings: \"\" + \"\" = \"\".",
      es: "Ambos arrays se convierten primero en cadenas vacías ([] → \"\"), y + concatena cadenas: \"\" + \"\" = \"\".",
    },
  },
  {
    expr: '!"hello"',
    rule: {
      en: "Non-empty strings are truthy, so ! flips it to false.",
      es: "Las cadenas no vacías son truthy, así que ! lo invierte a false.",
    },
  },
  {
    expr: '"5" * "2"',
    rule: {
      en: "The * operator only does math, so both strings become numbers: 5 * 2 = 10.",
      es: "El operador * solo hace matemáticas, así que ambas cadenas se convierten a números: 5 * 2 = 10.",
    },
  },
];

function normalize(v) {
  return String(v).trim().toLowerCase();
}

function matchesPrediction(pred, actual) {
  const p = normalize(pred);
  const a = normalize(actual);
  if (p === a) return true;
  if (a === "" && (p === '""' || p === "''" || p === "empty" || p === "empty string" || p === "vacío" || p === "vacio" || p === "cadena vacía" || p === "cadena vacia")) return true;
  return false;
}

export default function CoercionLab() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];
  const { run } = useSandbox();
  const [preds, setPreds] = useState({});
  const [results, setResults] = useState({}); // idx -> { actual, correct, revealing }

  const setPred = (i, value) => setPreds((p) => ({ ...p, [i]: value }));

  const reveal = async (i) => {
    const expr = ROWS[i].expr;
    setResults((r) => ({ ...r, [i]: { revealing: true } }));
    try {
      const res = await run(`console.log(${expr})`, "coercion-lab");
      const text = (res.lines || []).map((l) => l.text).join("\n");
      const actual = text === "" ? s.emptyString : text;
      const correct = matchesPrediction(preds[i] || "", text);
      setResults((r) => ({ ...r, [i]: { actual, correct, revealing: false } }));
    } catch {
      setResults((r) => ({ ...r, [i]: { revealing: false } }));
    }
  };

  const revealed = Object.values(results).filter((r) => r && !r.revealing && r.actual !== undefined);
  const correctCount = revealed.filter((r) => r.correct).length;

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        <h2>{s.title}</h2>
      </div>
      <div className="panel-body">
        <p className="lab-explain">{s.sub}</p>

        <div className="lab-stage" aria-live="polite">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{s.expression}</th>
                <th scope="col">{s.prediction}</th>
                <th scope="col">{s.reveal}</th>
                <th scope="col">{s.actual}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const res = results[i];
                return (
                  <tr key={row.expr}>
                    <td>
                      <code style={{ fontFamily: "var(--font-mono)" }}>{row.expr}</code>
                    </td>
                    <td>
                      <input
                        type="text"
                        aria-label={`${s.prediction}: ${row.expr}`}
                        value={preds[i] || ""}
                        onChange={(e) => setPred(i, e.target.value)}
                        placeholder={s.placeholder}
                        disabled={!!res && !res.revealing}
                        style={{
                          width: "100%",
                          minWidth: "8rem",
                          padding: "0.35rem 0.5rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--border)",
                          background: "var(--surface-1)",
                          color: "inherit",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => reveal(i)}
                        disabled={res?.revealing}
                        aria-label={`${s.runOne}: ${row.expr}`}
                      >
                        {res?.revealing ? t("labs.running") : s.reveal}
                      </button>
                    </td>
                    <td>
                      {res && !res.revealing && res.actual !== undefined && (
                        <span className="anim-in">
                          <code
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              color: res.correct ? "var(--green)" : "var(--amber)",
                            }}
                          >
                            {res.actual}
                          </code>{" "}
                          <span
                            className="badge"
                            style={{
                              borderColor: res.correct ? "var(--green)" : "var(--amber)",
                              color: res.correct ? "var(--green)" : "var(--amber)",
                            }}
                          >
                            {res.correct ? s.correct : s.wrong}
                          </span>
                          <div
                            className="lab-explain"
                            style={{ marginTop: "0.3rem", maxWidth: "22rem" }}
                          >
                            <strong>{s.rule}:</strong> {row.rule[lang]}
                          </div>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="callout" style={{ marginTop: "0.75rem" }} aria-live="polite">
          <strong>{s.score.replace("{x}", correctCount).replace("{y}", revealed.length)}</strong>
        </div>
      </div>
    </div>
  );
}
