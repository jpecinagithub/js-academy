import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useSandbox } from "../runtime/useSandbox.js";
import { CodeEditor } from "../components/CodeEditor.jsx";
import { Console } from "../components/Console.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Bug Lab",
    intro:
      "Four classic bugs. Read the symptom, run the broken code, then figure out the fix — or reveal it and study the lesson.",
    symptom: "Symptom",
    brokenCode: "Broken code",
    expectedOut: "Expected output (what you'll see)",
    run: "Run broken code",
    showFix: "Show fix",
    hideFix: "Hide fix",
    theFix: "The fix",
    lesson: "Lesson",
  },
  es: {
    title: "Laboratorio de bugs",
    intro:
      "Cuatro bugs clásicos. Lee el síntoma, ejecuta el código roto y descubre la solución — o revélala y estudia la lección.",
    symptom: "Síntoma",
    brokenCode: "Código roto",
    expectedOut: "Salida esperada (lo que verás)",
    run: "Ejecutar código roto",
    showFix: "Mostrar solución",
    hideFix: "Ocultar solución",
    theFix: "La solución",
    lesson: "Lección",
  },
};

const BUGS = [
  {
    id: "null-crash",
    title: { en: "Reading a property of null", es: "Leer una propiedad de null" },
    symptom: {
      en: "The program crashes immediately instead of printing a name.",
      es: "El programa se estrella al instante en lugar de imprimir un nombre.",
    },
    code: `const user = null;
console.log(user.name);`,
    expected: `TypeError: Cannot read properties of null (reading 'name')`,
    fix: `const user = { name: "Ada" };
console.log(user.name); // "Ada"

// or guard: console.log(user?.name);`,
    lesson: {
      en: "Never read properties of something that can be null/undefined — guard with user?.name first.",
      es: "Nunca leas propiedades de algo que puede ser null/undefined — protégete con user?.name primero.",
    },
  },
  {
    id: "foreach-map",
    title: { en: "forEach used as map", es: "forEach usado como map" },
    symptom: {
      en: "We expected [20, 40, 60] but the result is undefined.",
      es: "Esperábamos [20, 40, 60] pero el resultado es undefined.",
    },
    code: `const prices = [10, 20, 30];
const doubled = prices.forEach((p) => p * 2);
console.log(doubled);`,
    expected: `undefined`,
    fix: `const prices = [10, 20, 30];
const doubled = prices.map((p) => p * 2);
console.log(doubled); // [ 20, 40, 60 ]`,
    lesson: {
      en: "forEach always returns undefined — use map when you want a new array.",
      es: "forEach siempre devuelve undefined — usa map cuando quieras un array nuevo.",
    },
  },
  {
    id: "off-by-one",
    title: { en: "Off-by-one loop", es: "Bucle con error de uno" },
    symptom: {
      en: "The loop prints a, b, c… and then a mysterious extra undefined.",
      es: "El bucle imprime a, b, c… y luego un misterioso undefined extra.",
    },
    code: `const letters = ["a", "b", "c"];
for (let i = 0; i <= letters.length; i++) {
  console.log(letters[i]);
}`,
    expected: `a
b
c
undefined`,
    fix: `const letters = ["a", "b", "c"];
for (let i = 0; i < letters.length; i++) {
  console.log(letters[i]);
} // a, b, c — no more, no less`,
    lesson: {
      en: "Arrays are 0-indexed: valid indexes run from 0 to length - 1, so the loop condition is i < length.",
      es: "Los arrays empiezan en 0: los índices válidos van de 0 a length - 1, así que la condición es i < length.",
    },
  },
  {
    id: "missing-await",
    title: { en: "Missing await", es: "Falta un await" },
    symptom: {
      en: "We expected \"Ada\" but got undefined. The promise was never unwrapped.",
      es: "Esperábamos «Ada» pero obtuvimos undefined. La promesa nunca se desempaquetó.",
    },
    code: `async function getUser() {
  return { name: "Ada" };
}

const user = getUser(); // ← forgot await
console.log(user.name); // undefined — user is a Promise!`,
    expected: `undefined`,
    fix: `(async () => {
  async function getUser() {
    return { name: "Ada" };
  }

  const user = await getUser(); // ← await unwraps it
  console.log(user.name); // "Ada"
})();`,
    lesson: {
      en: "An async function always returns a promise — await it to get the value inside.",
      es: "Una función async siempre devuelve una promesa — usa await para obtener el valor de dentro.",
    },
  },
];

export default function BugLab() {
  const { t, L, lang } = useI18n();
  const s = STRINGS[lang];
  const [active, setActive] = useState(BUGS[0].id);
  const [code, setCode] = useState(BUGS[0].code);
  const [showFix, setShowFix] = useState(false);
  const { lines, running, timedOut, run, clear } = useSandbox();

  const bug = BUGS.find((b) => b.id === active) || BUGS[0];

  const select = (b) => {
    setActive(b.id);
    setCode(b.code);
    setShowFix(false);
    clear();
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="lab-controls" role="tablist" aria-label={s.title}>
          {BUGS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={b.id === active}
              className={`btn btn-sm ${b.id === active ? "btn-primary" : "btn-secondary"}`}
              onClick={() => select(b)}
            >
              {`🐞${i + 1} ${L(b.title)}`}
            </button>
          ))}
        </div>

        <div className="callout" role="note">
          <strong>{s.symptom}: </strong>
          {L(bug.symptom)}
        </div>

        <div className="grid-2">
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{s.brokenCode}</h3>
            <CodeEditor value={code} onChange={setCode} label={s.brokenCode} minHeight={220} />
            <div className="lab-controls">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => run(code, "bug-lab")}
                disabled={running}
              >
                {running ? t("labs.running") : `▶ ${s.run}`}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowFix((v) => !v)}
                aria-pressed={showFix}
              >
                {showFix ? s.hideFix : `🔧 ${s.showFix}`}
              </button>
            </div>
            <h3 style={{ fontSize: "0.9rem", marginTop: 12 }}>{t("labs.console")}</h3>
            {timedOut && <p style={{ color: "var(--amber)" }}>⚠ {t("labs.timedOut")}</p>}
            <Console lines={lines} />
          </div>
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{s.expectedOut}</h3>
            <div className="code-block">
              <pre>{bug.expected}</pre>
            </div>
            {showFix && (
              <div className="fix-box" aria-live="polite">
                <h4 style={{ margin: "0 0 8px" }}>{s.theFix}</h4>
                <div className="code-block" style={{ margin: "0 0 12px" }}>
                  <pre>
                    <HighlightedCode code={bug.fix} />
                  </pre>
                </div>
                <p style={{ margin: 0 }}>
                  <strong>💡 {s.lesson}: </strong>
                  {L(bug.lesson)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
