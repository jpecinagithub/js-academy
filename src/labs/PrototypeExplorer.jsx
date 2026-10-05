import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Prototype Explorer",
    intro:
      "When JavaScript can't find a property on an object, it walks up the prototype chain. Pick a subject and a property, then walk the chain and watch where the lookup lands.",
    subject: "Subject",
    property: "Property",
    walk: "Walk the chain",
    reset: "Reset",
    checking: (name) => `Checking ${name}…`,
    notHere: (prop) => `✗ ${prop} is not here`,
    foundAt: (prop, name) => `✓ Found "${prop}" on ${name} — lookup stops here`,
    doneFound: (prop, name) => `The property "${prop}" lives on ${name}.`,
    doneMissing: (prop) => `"${prop}" was not found anywhere — the chain ends at null.`,
    snippet: "The real code behind this",
    subjects: {
      array: "Array instance",
      object: "Plain object",
      function: "Function",
      class: "Class instance",
    },
  },
  es: {
    title: "Explorador de prototipos",
    intro:
      "Cuando JavaScript no encuentra una propiedad en un objeto, sube por la cadena de prototipos. Elige un sujeto y una propiedad, recorre la cadena y mira dónde aterriza la búsqueda.",
    subject: "Sujeto",
    property: "Propiedad",
    walk: "Recorrer la cadena",
    reset: "Reiniciar",
    checking: (name) => `Comprobando ${name}…`,
    notHere: (prop) => `✗ ${prop} no está aquí`,
    foundAt: (prop, name) => `✓ "${prop}" encontrada en ${name} — la búsqueda se detiene aquí`,
    doneFound: (prop, name) => `La propiedad "${prop}" vive en ${name}.`,
    doneMissing: (prop) => `"${prop}" no se encontró en ningún sitio — la cadena termina en null.`,
    snippet: "El código real detrás de esto",
    subjects: {
      array: "Instancia de Array",
      object: "Objeto simple",
      function: "Función",
      class: "Instancia de clase",
    },
  },
};

const SUBJECTS = ["array", "object", "function", "class"];

const PROPS = {
  array: ["map", "push", "length", "toString", "hasOwnProperty", "constructor"],
  object: ["toString", "hasOwnProperty", "valueOf", "map"],
  function: ["call", "length", "toString", "apply"],
  class: ["toString", "hasOwnProperty", "constructor"],
};

const SNIPPETS = {
  array: "Object.getPrototypeOf([1, 2, 3]) === Array.prototype; // true",
  object: "Object.getPrototypeOf({ a: 1 }) === Object.prototype; // true",
  function: "Object.getPrototypeOf(function f() {}) === Function.prototype; // true",
  class: "class Animal {}\nObject.getPrototypeOf(new Animal()) === Animal.prototype; // true",
};

function getLinks(kind) {
  if (kind === "array") {
    const obj = [1, 2, 3];
    return [
      { name: "obj  ([1,2,3])", ref: obj },
      { name: "Array.prototype", ref: Array.prototype },
      { name: "Object.prototype", ref: Object.prototype },
    ];
  }
  if (kind === "function") {
    const obj = function f() {};
    return [
      { name: "obj  (function f)", ref: obj },
      { name: "Function.prototype", ref: Function.prototype },
      { name: "Object.prototype", ref: Object.prototype },
    ];
  }
  if (kind === "class") {
    class Animal {}
    const obj = new Animal();
    return [
      { name: "obj  (new Animal())", ref: obj },
      { name: "Animal.prototype", ref: Animal.prototype },
      { name: "Object.prototype", ref: Object.prototype },
    ];
  }
  const obj = { a: 1 };
  return [
    { name: "obj  ({a: 1})", ref: obj },
    { name: "Object.prototype", ref: Object.prototype },
  ];
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export default function PrototypeExplorer() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [subject, setSubject] = useState("array");
  const [prop, setProp] = useState("map");
  const [walkStep, setWalkStep] = useState(-1); // -1 idle, 0..n-1 walking, n = done
  const timer = useRef(null);

  const links = getLinks(subject);
  const foundIdx = links.findIndex((l) => hasOwn(l.ref, prop));
  const walking = walkStep >= 0 && walkStep < links.length;
  const done = walkStep >= links.length;

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(stop, []);

  const reset = () => {
    stop();
    setWalkStep(-1);
  };

  const walk = () => {
    stop();
    setWalkStep(0);
    timer.current = setInterval(() => {
      setWalkStep((v) => {
        if (v + 1 > links.length) {
          stop();
          return v;
        }
        if (v + 1 === links.length) stop();
        return v + 1;
      });
    }, 850);
  };

  const changeSubject = (k) => {
    reset();
    setSubject(k);
    setProp(PROPS[k][0]);
  };

  const changeProp = (p) => {
    reset();
    setProp(p);
  };

  const narrate = () => {
    if (walkStep === -1) return null;
    if (walkStep < links.length) {
      const name = links[walkStep].name;
      if (walkStep === foundIdx) return s.foundAt(prop, name);
      return `${s.checking(name)}  ${s.notHere(prop)}`;
    }
    return foundIdx >= 0 ? s.doneFound(prop, links[foundIdx].name) : s.doneMissing(prop);
  };

  const nodeStyle = (i) => {
    const isFound = i === foundIdx;
    if (walkStep === i) {
      return isFound
        ? { borderColor: "var(--accent)", background: "var(--accent-dim)", color: "var(--accent)" }
        : { borderColor: "var(--amber)", background: "color-mix(in srgb, var(--amber) 12%, transparent)", color: "var(--text)" };
    }
    if (walkStep > i) {
      return isFound
        ? { borderColor: "var(--accent)", background: "var(--accent-dim)" }
        : { borderColor: "var(--border)", opacity: 0.75 };
    }
    return undefined;
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          <div className="lab-controls" style={{ marginTop: 0 }} role="group" aria-label={s.subject}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)", alignSelf: "center" }}>
              {s.subject}:
            </span>
            {SUBJECTS.map((k) => (
              <button
                key={k}
                type="button"
                className={`btn btn-sm ${subject === k ? "btn-primary" : "btn-secondary"}`}
                onClick={() => changeSubject(k)}
                aria-pressed={subject === k}
              >
                {s.subjects[k]}
              </button>
            ))}
          </div>
          <div className="lab-controls" style={{ marginTop: 0 }} role="group" aria-label={s.property}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)", alignSelf: "center" }}>
              {s.property}:
            </span>
            {PROPS[subject].map((p) => (
              <button
                key={p}
                type="button"
                className={`btn btn-sm ${prop === p ? "btn-primary" : "btn-secondary"}`}
                onClick={() => changeProp(p)}
                aria-pressed={prop === p}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="lab-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={walk} disabled={walking}>
            {s.walk}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {s.reset}
          </button>
        </div>

        <div className="lab-stage" aria-live="polite">
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              flexWrap: "wrap",
            }}
          >
            {links.map((l, i) => (
              <span key={l.name} style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="badge"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    padding: "10px 14px",
                    transition: "all 0.25s",
                    ...nodeStyle(i),
                  }}
                >
                  {l.name}
                  {walkStep > i && i === foundIdx && " ✓"}
                </span>
                <span
                  aria-hidden="true"
                  style={{ fontSize: "1.4rem", color: "var(--accent)", margin: "0 6px" }}
                >
                  →
                </span>
              </span>
            ))}
            <span
              className="badge"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                padding: "10px 14px",
                opacity: done ? 1 : 0.6,
              }}
            >
              null
            </span>
          </div>
          {narrate() && (
            <p
              style={{
                margin: "14px 0 0",
                fontWeight: 700,
                color:
                  walkStep === foundIdx || (done && foundIdx >= 0)
                    ? "var(--accent)"
                    : "var(--text)",
              }}
            >
              {narrate()}
            </p>
          )}
        </div>

        <h3 style={{ fontSize: "0.9rem" }}>{s.snippet}</h3>
        <div className="code-block">
          <pre>
            <HighlightedCode code={SNIPPETS[subject]} />
          </pre>
        </div>
      </div>
    </div>
  );
}
