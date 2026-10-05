import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Scope Explorer",
    intro:
      "Click a variable chip to see every scope it is visible from, or click a scope box to see which variables are visible there.",
    sampleCode: "Sample code",
    treeTitle: "Scope tree",
    scopes: {
      global: "GLOBAL",
      fn: "FUNCTION test()",
      block: "BLOCK { … }",
    },
    scopeDesc: {
      global: "the outermost scope — visible to the whole script",
      fn: "the scope created by the function test()",
      block: "the scope created by the { } block inside test()",
    },
    varVisible: (name, places) => `\`${name}\` is visible from: ${places}.`,
    varHidden: (name, places) => `\`${name}\` is NOT visible from: ${places}.`,
    scopeSees: (scope, vars) =>
      `From ${scope} you can see: ${vars.length ? vars.map((v) => `\`${v}\``).join(", ") : "no variables"}.`,
    selectVar: "Pick a variable",
    selectScope: "Pick a scope",
    quizTitle: "Access quiz",
    quizQ: "Can it be accessed?",
    quizYes: (v, sc) => `Yes — \`${v}\` is visible from ${sc}.`,
    quizNo: (v, sc) => `No — \`${v}\` cannot be reached from ${sc}.`,
    quizReasonOuter: (v, declared) =>
      `Inner scopes are invisible from outer ones: \`${v}\` lives in ${declared}, which is inside — not outside.`,
    quizReasonInner: (v, declared) =>
      `Scopes can look outward: ${declared} is an outer scope of where you asked, so \`${v}\` is reachable.`,
    legendDeclared: "declared here",
    legendVisible: "visible here",
    hint: "Rule of thumb: code can see variables declared in its own scope and in outer scopes — never in inner ones.",
  },
  es: {
    title: "Explorador de ámbitos",
    intro:
      "Haz clic en una variable para ver todos los ámbitos desde los que es visible, o haz clic en un ámbito para ver qué variables son visibles allí.",
    sampleCode: "Código de ejemplo",
    treeTitle: "Árbol de ámbitos",
    scopes: {
      global: "GLOBAL",
      fn: "FUNCIÓN test()",
      block: "BLOQUE { … }",
    },
    scopeDesc: {
      global: "el ámbito más externo — visible para todo el script",
      fn: "el ámbito creado por la función test()",
      block: "el ámbito creado por el bloque { } dentro de test()",
    },
    varVisible: (name, places) => `\`${name}\` es visible desde: ${places}.`,
    varHidden: (name, places) => `\`${name}\` NO es visible desde: ${places}.`,
    scopeSees: (scope, vars) =>
      `Desde ${scope} puedes ver: ${vars.length ? vars.map((v) => `\`${v}\``).join(", ") : "ninguna variable"}.`,
    selectVar: "Elige una variable",
    selectScope: "Elige un ámbito",
    quizTitle: "Miniquiz de acceso",
    quizQ: "¿Se puede acceder?",
    quizYes: (v, sc) => `Sí — \`${v}\` es visible desde ${sc}.`,
    quizNo: (v, sc) => `No — no se puede llegar a \`${v}\` desde ${sc}.`,
    quizReasonOuter: (v, declared) =>
      `Los ámbitos internos son invisibles desde los externos: \`${v}\` vive en ${declared}, que está dentro — no fuera.`,
    quizReasonInner: (v, declared) =>
      `Los ámbitos pueden mirar hacia fuera: ${declared} es un ámbito exterior al que preguntaste, así que \`${v}\` es alcanzable.`,
    legendDeclared: "declarada aquí",
    legendVisible: "visible aquí",
    hint: "Regla de oro: el código puede ver las variables declaradas en su propio ámbito y en los exteriores — nunca en los interiores.",
  },
};

const SAMPLE = `const x = 10;            // global

function test() {        // function scope
  const y = 20;
  if (true) {            // block scope
    const z = 30;
    console.log(x, y, z);
  }
}`;

const ORDER = ["global", "fn", "block"];
const PARENT = { fn: "global", block: "fn" };
const OWN_VARS = { global: ["x"], fn: ["y"], block: ["z"] };
const VAR_SCOPE = { x: "global", y: "fn", z: "block" };

function ancestors(scope) {
  const out = [];
  let cur = scope;
  while (cur) {
    out.push(cur);
    cur = PARENT[cur];
  }
  return out;
}

function visibleScopesOf(name) {
  const declared = VAR_SCOPE[name];
  return ORDER.filter((sc) => ancestors(sc).includes(declared));
}

function visibleVarsOf(scope) {
  return ancestors(scope)
    .flatMap((sc) => OWN_VARS[sc])
    .sort((a, b) => ORDER.indexOf(VAR_SCOPE[a]) - ORDER.indexOf(VAR_SCOPE[b]));
}

export default function ScopeExplorer() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [selVar, setSelVar] = useState(null);
  const [selScope, setSelScope] = useState(null);
  const [quizVar, setQuizVar] = useState("x");
  const [quizScope, setQuizScope] = useState("global");
  const [quizResult, setQuizResult] = useState(null);

  const pickVar = (name) => {
    setSelVar(name);
    setSelScope(null);
  };
  const pickScope = (scope) => {
    setSelScope(scope);
    setSelVar(null);
  };

  const visScopes = selVar ? visibleScopesOf(selVar) : [];
  const hiddenScopes = selVar ? ORDER.filter((sc) => !visScopes.includes(sc)) : [];
  const seesVars = selScope ? visibleVarsOf(selScope) : [];

  const scopeLabel = (sc) => s.scopes[sc];
  const places = (list) => list.map((sc) => scopeLabel(sc)).join(", ");

  const checkQuiz = () => {
    setQuizResult({ ok: visibleScopesOf(quizVar).includes(quizScope) });
  };

  const quizReason = () => {
    if (!quizResult) return null;
    const declared = scopeLabel(VAR_SCOPE[quizVar]);
    const asked = scopeLabel(quizScope);
    const verdict = quizResult.ok ? s.quizYes(quizVar, asked) : s.quizNo(quizVar, asked);
    const reason = quizResult.ok
      ? s.quizReasonInner(quizVar, declared)
      : s.quizReasonOuter(quizVar, declared);
    return `${verdict} ${reason}`;
  };

  const scopeBox = (scope) => {
    const isSelected = selScope === scope;
    const isDeclared = selVar && VAR_SCOPE[selVar] === scope;
    const isVisible = selVar && !isDeclared && visScopes.includes(scope);
    const borderColor = isSelected || isDeclared
      ? "var(--accent)"
      : isVisible
        ? "var(--success, #3ddc97)"
        : "var(--border)";
    const bg = isSelected || isDeclared ? "var(--accent-dim)" : "transparent";
    return (
      <button
        key={scope}
        type="button"
        onClick={() => pickScope(scope)}
        aria-pressed={isSelected}
        aria-label={`${scopeLabel(scope)} — ${s.scopeDesc[scope]}`}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          border: `2px solid ${borderColor}`,
          background: bg,
          borderRadius: "var(--radius-m)",
          padding: "12px 14px",
          margin: "10px 0",
          color: "inherit",
          font: "inherit",
        }}
      >
        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{scopeLabel(scope)}</strong>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{s.scopeDesc[scope]}</span>
        </span>
        <span style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {OWN_VARS[scope].map((name) => (
            <button
              key={name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pickVar(name);
              }}
              aria-pressed={selVar === name}
              style={{
                cursor: "pointer",
                border: `2px solid ${selVar === name ? "var(--accent)" : "var(--border)"}`,
                background: selVar === name ? "var(--accent-dim)" : "var(--surface-2)",
                color: "inherit",
                borderRadius: 999,
                padding: "4px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
              }}
            >
              {name}
            </button>
          ))}
        </span>
        {scope === "global" && scopeBox("fn")}
        {scope === "fn" && scopeBox("block")}
      </button>
    );
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <h3 style={{ fontSize: "0.9rem" }}>{s.sampleCode}</h3>
        <div className="code-block">
          <pre>
            <HighlightedCode code={SAMPLE} />
          </pre>
        </div>

        <h3 style={{ fontSize: "0.9rem" }}>{s.treeTitle}</h3>
        <div className="lab-stage" aria-live="polite">
          {scopeBox("global")}
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 8 }}>
            <span style={{ color: "var(--accent)" }}>■</span> {s.legendDeclared}
            {" · "}
            <span style={{ color: "var(--success, #3ddc97)" }}>■</span> {s.legendVisible}
          </p>
        </div>

        <div className="lab-explain" aria-live="polite">
          {selVar && (
            <>
              <p>{s.varVisible(selVar, places(visScopes))}</p>
              {hiddenScopes.length > 0 && <p>{s.varHidden(selVar, places(hiddenScopes))}</p>}
            </>
          )}
          {selScope && <p>{s.scopeSees(scopeLabel(selScope), seesVars)}</p>}
          {!selVar && !selScope && <p>{s.hint}</p>}
        </div>

        <h3 style={{ fontSize: "0.9rem" }}>{s.quizTitle}</h3>
        <div className="lab-controls">
          <label>
            {s.selectVar}{" "}
            <select value={quizVar} onChange={(e) => setQuizVar(e.target.value)} aria-label={s.selectVar}>
              {["x", "y", "z"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            {s.selectScope}{" "}
            <select value={quizScope} onChange={(e) => setQuizScope(e.target.value)} aria-label={s.selectScope}>
              {ORDER.map((sc) => (
                <option key={sc} value={sc}>
                  {scopeLabel(sc)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={checkQuiz}>
            {s.quizQ}
          </button>
        </div>
        {quizResult && (
          <div className="lab-explain anim-in" aria-live="polite">
            <strong>{quizResult.ok ? "✓" : "✗"}</strong> {quizReason()}
          </div>
        )}
      </div>
    </div>
  );
}
