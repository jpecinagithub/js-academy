import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useSandbox } from "../runtime/useSandbox.js";
import { Console } from "../components/Console.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "this Lab",
    intro:
      "Pick a context, run the snippet in the real sandbox, and see exactly what `this` is. Remember: the sandbox runs in strict mode.",
    context: "Context",
    run: "Run snippet",
    thisIs: "this is…",
    rule: "Rule",
  },
  es: {
    title: "Laboratorio de this",
    intro:
      "Elige un contexto, ejecuta el fragmento en el sandbox real y mira exactamente qué es `this`. Recuerda: el sandbox se ejecuta en modo estricto.",
    context: "Contexto",
    run: "Ejecutar fragmento",
    thisIs: "this es…",
    rule: "Regla",
  },
};

const CASES = [
  {
    id: "global",
    label: { en: "Global (top level)", es: "Global (nivel superior)" },
    code: `console.log(this); // what prints here?`,
    thisIs: {
      en: "undefined — the top-level this is not the global object in strict mode (and in ES modules).",
      es: "undefined — el this de nivel superior no es el objeto global en modo estricto (ni en módulos ES).",
    },
    rule: {
      en: "In strict mode, top-level this is undefined, not window/globalThis.",
      es: "En modo estricto, el this de nivel superior es undefined, no window/globalThis.",
    },
  },
  {
    id: "method",
    label: { en: "Object method", es: "Método de objeto" },
    code: `const user = {
  name: "Ada",
  greet() {
    return "Hi, I'm " + this.name;
  },
};

console.log(user.greet());`,
    thisIs: {
      en: "user — the object before the dot.",
      es: "user — el objeto antes del punto.",
    },
    rule: {
      en: "In a method call obj.method(), this is obj.",
      es: "En una llamada de método obj.method(), this es obj.",
    },
  },
  {
    id: "plain",
    label: { en: "Plain function call", es: "Llamada a función simple" },
    code: `function whoAmI() {
  return this;
}

console.log(String(whoAmI()));`,
    thisIs: {
      en: "undefined — a plain call has no receiver in strict mode.",
      es: "undefined — una llamada simple no tiene receptor en modo estricto.",
    },
    rule: {
      en: "Calling a function as f() (not as a method) sets this to undefined in strict mode.",
      es: "Llamar a una función como f() (no como método) deja this en undefined en modo estricto.",
    },
  },
  {
    id: "arrow",
    label: { en: "Arrow function", es: "Función flecha" },
    code: `const user = {
  name: "Ada",
  greet() {
    const arrow = () => this.name;
    return arrow();
  },
};

console.log(user.greet());`,
    thisIs: {
      en: "user — inherited from greet's scope, not set by the call.",
      es: "user — heredado del ámbito de greet, no fijado por la llamada.",
    },
    rule: {
      en: "Arrow functions have no own this — they inherit it lexically from the surrounding scope.",
      es: "Las funciones flecha no tienen this propio — lo heredan léxicamente del ámbito que las rodea.",
    },
  },
  {
    id: "detached",
    label: { en: "Detached method", es: "Método separado" },
    code: `const user = {
  name: "Ada",
  greet() {
    return "Hi, I'm " + this.name;
  },
};

const fn = user.greet; // detached — no longer a method call
try {
  console.log(fn());
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
    thisIs: {
      en: "undefined — and the call crashes, because this.name becomes a property read on undefined.",
      es: "undefined — y la llamada se estrella, porque this.name se convierte en una lectura de propiedad sobre undefined.",
    },
    rule: {
      en: "Detaching a method (const fn = obj.m) loses its this — fn() is a plain call again.",
      es: "Separar un método (const fn = obj.m) pierde su this — fn() vuelve a ser una llamada simple.",
    },
  },
];

export default function ThisLab() {
  const { t, L, lang } = useI18n();
  const s = STRINGS[lang];
  const [active, setActive] = useState(CASES[0].id);
  const { lines, running, timedOut, run, clear } = useSandbox();

  const activeCase = CASES.find((c) => c.id === active) || CASES[0];

  const select = (c) => {
    setActive(c.id);
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

        <div className="lab-controls" role="tablist" aria-label={s.context}>
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === active}
              className={`btn btn-sm ${c.id === active ? "btn-primary" : "btn-secondary"}`}
              onClick={() => select(c)}
            >
              {L(c.label)}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div>
            <div className="code-block" aria-label={L(activeCase.label)}>
              <pre>
                <HighlightedCode code={activeCase.code} />
              </pre>
            </div>
            <div className="lab-controls">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => run(activeCase.code, "this-lab")}
                disabled={running}
              >
                {running ? t("labs.running") : `▶ ${s.run}`}
              </button>
            </div>
            {timedOut && <p style={{ color: "var(--amber)" }}>⚠ {t("labs.timedOut")}</p>}
            <Console lines={lines} />
          </div>
          <div>
            <div className="lab-explain" aria-live="polite">
              <p style={{ margin: "0 0 8px" }}>
                <strong>{s.thisIs}</strong>
              </p>
              <p style={{ margin: 0 }}>{L(activeCase.thisIs)}</p>
            </div>
            <div className="takeaway" style={{ marginTop: 16 }}>
              <strong>💡 {s.rule}: </strong>
              {L(activeCase.rule)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
