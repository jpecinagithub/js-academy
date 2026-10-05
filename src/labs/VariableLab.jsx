import { useMemo, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { CodeEditor } from "../components/CodeEditor.jsx";
import { HighlightedCode } from "../components/highlight.jsx";
import { Console } from "../components/Console.jsx";

const STRINGS = {
  en: {
    title: "Variable Lab",
    intro:
      "A scripted interpreter. Write code with the mini-language below, then run it line by line and watch memory change.",
    yourCode: "Your code",
    execution: "Execution view",
    stepInfo: "Next line",
    done: "Finished — no more lines to execute.",
    status: "Status",
    colValue: "Value",
    colKind: "Kind",
    changed: "changed",
    stored: "stored",
    kindLet: "let",
    kindConst: "const",
    miniLang:
      "Mini-language: let NAME = EXPR; · const NAME = EXPR; · NAME = EXPR; · console.log(EXPR); — expressions support numbers, strings, variables, parentheses and + - * / %.",
    explainDecl: (line, kw, name, expr, value) =>
      expr === null
        ? `Line ${line}: declared \`${name}\` in memory as ${kw}, with no initial value (undefined).`
        : `Line ${line}: created \`${name}\` in memory as ${kw}, with the value of \`${expr}\` = ${value}.`,
    explainAssign: (line, name, prev, next) =>
      `Line ${line}: updated \`${name}\` in memory from ${prev} to ${next}.`,
    explainLog: (line, expr, value) =>
      `Line ${line}: evaluated \`${expr}\` = ${value} and printed it to the console.`,
    errConst: (n) => `TypeError: Assignment to constant variable '${n}'.`,
    errNotDefined: (n) => `ReferenceError: ${n} is not defined.`,
    errRedeclared: (n) => `SyntaxError: Identifier '${n}' has already been declared.`,
    errSyntax: (n) => `SyntaxError: Unexpected syntax on line ${n}.`,
  },
  es: {
    title: "Laboratorio de variables",
    intro:
      "Un intérprete guionizado. Escribe código con el minilenguaje de abajo, ejecútalo línea a línea y observa cómo cambia la memoria.",
    yourCode: "Tu código",
    execution: "Vista de ejecución",
    stepInfo: "Próxima línea",
    done: "Terminado — no quedan líneas por ejecutar.",
    status: "Estado",
    colValue: "Valor",
    colKind: "Tipo",
    changed: "cambió",
    stored: "guardada",
    kindLet: "let",
    kindConst: "const",
    miniLang:
      "Minilenguaje: let NOMBRE = EXPR; · const NOMBRE = EXPR; · NOMBRE = EXPR; · console.log(EXPR); — las expresiones aceptan números, cadenas, variables, paréntesis y + - * / %.",
    explainDecl: (line, kw, name, expr, value) =>
      expr === null
        ? `Línea ${line}: se declaró \`${name}\` en memoria como ${kw}, sin valor inicial (undefined).`
        : `Línea ${line}: se creó \`${name}\` en memoria como ${kw}, con el valor de \`${expr}\` = ${value}.`,
    explainAssign: (line, name, prev, next) =>
      `Línea ${line}: se actualizó \`${name}\` en memoria de ${prev} a ${next}.`,
    explainLog: (line, expr, value) =>
      `Línea ${line}: se evaluó \`${expr}\` = ${value} y se imprimió en la consola.`,
    errConst: (n) => `TypeError: Asignación a una variable constante '${n}'.`,
    errNotDefined: (n) => `ReferenceError: ${n} no está definida.`,
    errRedeclared: (n) => `SyntaxError: El identificador '${n}' ya ha sido declarado.`,
    errSyntax: (n) => `SyntaxError: Sintaxis inesperada en la línea ${n}.`,
  },
};

const DEFAULT_CODE = `let x = 10;
let y = 20;
let result = x + y;
result = result * 2;
console.log(result);`;

/* ---------------- Tiny expression parser (no eval) ---------------- */

function unescapeStr(quoted) {
  const inner = quoted.slice(1, -1);
  const table = { n: "\n", t: "\t", r: "\r", "\\": "\\", '"': '"', "'": "'" };
  return inner.replace(/\\(.)/g, (_, c) => (c in table ? table[c] : c));
}

function tokenize(src) {
  const tokens = [];
  const re =
    /\s*(?:(\d+(?:\.\d+)?)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([A-Za-z_$][\w$]*)|([+\-*/%()]))/gy;
  let m;
  let pos = 0;
  while ((m = re.exec(src)) !== null) {
    pos = re.lastIndex;
    const [, num, str, ident, op] = m;
    if (num !== undefined) tokens.push({ t: "n", v: parseFloat(num) });
    else if (str !== undefined) tokens.push({ t: "s", v: unescapeStr(str) });
    else if (ident !== undefined) tokens.push({ t: "i", v: ident });
    else tokens.push({ t: "o", v: op });
  }
  if (src.slice(pos).trim() !== "") throw { code: "syntax" };
  return tokens;
}

function parseExpr(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const eat = () => tokens[i++];
  function primary() {
    const tok = eat();
    if (!tok) throw { code: "syntax" };
    if (tok.t === "n") return { k: "num", v: tok.v };
    if (tok.t === "s") return { k: "str", v: tok.v };
    if (tok.t === "i") return { k: "var", name: tok.v };
    if (tok.t === "o" && tok.v === "(") {
      const e = add();
      const c = eat();
      if (!c || c.t !== "o" || c.v !== ")") throw { code: "syntax" };
      return e;
    }
    throw { code: "syntax" };
  }
  function mul() {
    let left = primary();
    let p = peek();
    while (p && p.t === "o" && (p.v === "*" || p.v === "/" || p.v === "%")) {
      eat();
      left = { k: "bin", op: p.v, l: left, r: primary() };
      p = peek();
    }
    return left;
  }
  function add() {
    let left = mul();
    let p = peek();
    while (p && p.t === "o" && (p.v === "+" || p.v === "-")) {
      eat();
      left = { k: "bin", op: p.v, l: left, r: mul() };
      p = peek();
    }
    return left;
  }
  const ast = add();
  if (i !== tokens.length) throw { code: "syntax" };
  return ast;
}

function evalAst(node, mem) {
  if (node.k === "num" || node.k === "str") return node.v;
  if (node.k === "var") {
    if (!Object.prototype.hasOwnProperty.call(mem, node.name))
      throw { code: "notDefined", name: node.name };
    return mem[node.name].value;
  }
  const l = evalAst(node.l, mem);
  const r = evalAst(node.r, mem);
  if (node.op === "+")
    return typeof l === "string" || typeof r === "string" ? String(l) + String(r) : l + r;
  if (node.op === "-") return l - r;
  if (node.op === "*") return l * r;
  if (node.op === "/") return l / r;
  return l % r;
}

/* ---------------- Statement parser ---------------- */

const IDENT = "[A-Za-z_$][\\w$]*";

function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "/" && line[i + 1] === "/") return line.slice(0, i);
  }
  return line;
}

function parseLine(raw) {
  const line = stripComment(raw).trim();
  if (!line) return { kind: "empty" };
  let m;
  if ((m = line.match(new RegExp(`^(let|const)\\s+(${IDENT})(.*);\\s*$`)))) {
    const rest = m[3].trim();
    if (rest === "") return { kind: "decl", kw: m[1], name: m[2], exprSrc: null };
    const eq = rest.match(/^=\s*(.+)$/s);
    if (!eq) return { kind: "bad" };
    return { kind: "decl", kw: m[1], name: m[2], exprSrc: eq[1].trim() };
  }
  if ((m = line.match(/^console\.log\((.*)\);\s*$/s))) return { kind: "log", exprSrc: m[1].trim() };
  if ((m = line.match(new RegExp(`^(${IDENT})\\s*=\\s*(.+);\\s*$`, "s")))) {
    if (m[1] === "let" || m[1] === "const") return { kind: "bad" };
    const exprSrc = m[2].trim();
    if (!exprSrc) return { kind: "bad" };
    return { kind: "assign", name: m[1], exprSrc };
  }
  return { kind: "bad" };
}

function fmtValue(v) {
  if (typeof v === "string") return `"${v}"`;
  if (v === undefined) return "undefined";
  return String(v);
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** Executes one parsed statement. Returns fresh {mem, logs, event, touched} or throws. */
function executeLine(stmt, mem, logs) {
  const nextMem = { ...mem };
  const nextLogs = [...logs];
  const evalExpr = (src) => evalAst(parseExpr(tokenize(src)), nextMem);
  if (stmt.kind === "decl") {
    if (hasOwn(nextMem, stmt.name)) throw { code: "redeclared", name: stmt.name };
    const value = stmt.exprSrc !== null ? evalExpr(stmt.exprSrc) : undefined;
    nextMem[stmt.name] = { kind: stmt.kw, value };
    return {
      mem: nextMem,
      logs: nextLogs,
      touched: stmt.name,
      event: { type: "decl", kw: stmt.kw, name: stmt.name, exprSrc: stmt.exprSrc, value },
    };
  }
  if (stmt.kind === "assign") {
    if (!hasOwn(nextMem, stmt.name)) throw { code: "notDefined", name: stmt.name };
    if (nextMem[stmt.name].kind === "const") throw { code: "constAssign", name: stmt.name };
    const prev = nextMem[stmt.name].value;
    const value = evalExpr(stmt.exprSrc);
    nextMem[stmt.name] = { ...nextMem[stmt.name], value };
    return {
      mem: nextMem,
      logs: nextLogs,
      touched: stmt.name,
      event: { type: "assign", name: stmt.name, prev, value },
    };
  }
  if (stmt.kind === "log") {
    const value = evalExpr(stmt.exprSrc);
    nextLogs.push({ level: "log", text: fmtValue(value) });
    return {
      mem: nextMem,
      logs: nextLogs,
      touched: null,
      event: { type: "log", exprSrc: stmt.exprSrc, value },
    };
  }
  throw { code: "syntax" };
}

export default function VariableLab() {
  const { t, lang } = useI18n();
  const s = STRINGS[lang];
  const [code, setCode] = useState(DEFAULT_CODE);
  const [step, setStep] = useState(0);
  const [mem, setMem] = useState({});
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [event, setEvent] = useState(null);
  const [touched, setTouched] = useState(null);
  const [showExplain, setShowExplain] = useState(false);

  const parsed = useMemo(
    () => code.split("\n").map((raw, i) => ({ no: i + 1, raw, stmt: parseLine(raw) })),
    [code]
  );

  const nextIdx = useMemo(() => {
    for (let i = step; i < parsed.length; i++) if (parsed[i].stmt.kind !== "empty") return i;
    return -1;
  }, [step, parsed]);
  const finished = nextIdx === -1 && !error;

  const reset = () => {
    setStep(0);
    setMem({});
    setLogs([]);
    setError(null);
    setErrorLine(null);
    setEvent(null);
    setTouched(null);
  };

  const onCodeChange = (next) => {
    setCode(next);
    reset();
  };

  const errorText = (e, lineNo) => {
    if (e.code === "constAssign") return s.errConst(e.name);
    if (e.code === "notDefined") return s.errNotDefined(e.name);
    if (e.code === "redeclared") return s.errRedeclared(e.name);
    return s.errSyntax(lineNo);
  };

  const doStep = () => {
    if (error || finished) return;
    const idx = nextIdx;
    const { stmt, no } = parsed[idx];
    try {
      const r = executeLine(stmt, mem, logs);
      setMem(r.mem);
      setLogs(r.logs);
      setEvent({ ...r.event, line: no });
      setTouched(r.touched);
      setStep(idx + 1);
    } catch (e) {
      setError(errorText(e, no));
      setErrorLine(no);
    }
  };

  const doRun = () => {
    if (error || finished) return;
    let m = mem;
    let l = logs;
    let idx = step;
    let ev = event;
    let touch = touched;
    let err = null;
    let errLine = null;
    while (idx < parsed.length && !err) {
      const { stmt, no } = parsed[idx];
      if (stmt.kind === "empty") {
        idx++;
        continue;
      }
      try {
        const r = executeLine(stmt, m, l);
        m = r.mem;
        l = r.logs;
        ev = { ...r.event, line: no };
        touch = r.touched;
        idx++;
      } catch (e) {
        err = errorText(e, no);
        errLine = no;
      }
    }
    setMem(m);
    setLogs(l);
    setStep(idx);
    setEvent(ev);
    setTouched(touch);
    setError(err);
    setErrorLine(errLine);
  };

  const explainText = () => {
    if (!event) return null;
    if (event.type === "decl")
      return s.explainDecl(event.line, event.kw, event.name, event.exprSrc, fmtValue(event.value));
    if (event.type === "assign")
      return s.explainAssign(event.line, event.name, fmtValue(event.prev), fmtValue(event.value));
    return s.explainLog(event.line, event.exprSrc, fmtValue(event.value));
  };

  const highlightLines = error ? [errorLine] : !finished && nextIdx >= 0 ? [parsed[nextIdx].no] : [];
  const memRows = Object.entries(mem);

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{s.miniLang}</p>

        <div className="lab-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={doRun} disabled={finished || !!error}>
            {t("labs.run")}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={doStep} disabled={finished || !!error}>
            {t("labs.step")}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t("labs.reset")}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowExplain((v) => !v)}
            aria-pressed={showExplain}
          >
            {t("labs.explain")}
          </button>
        </div>

        <div className="grid-2">
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{s.yourCode}</h3>
            <CodeEditor value={code} onChange={onCodeChange} label={s.yourCode} minHeight={200} />
          </div>
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{s.execution}</h3>
            <div className="code-block">
              <pre>
                <HighlightedCode code={code} highlightLines={highlightLines} />
              </pre>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }} aria-live="polite">
              {error
                ? `${t("labs.errorIn")} — ${s.stepInfo} ${errorLine}`
                : finished
                  ? s.done
                  : `${s.stepInfo}: ${parsed[nextIdx].no}`}
            </p>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{t("labs.memory")}</h3>
            <table className="data-table" aria-live="polite">
              <thead>
                <tr>
                  <th>{t("labs.variables")}</th>
                  <th>{s.colValue}</th>
                  <th>{s.colKind}</th>
                  <th>{s.status}</th>
                </tr>
              </thead>
              <tbody>
                {memRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--muted)" }}>
                      —
                    </td>
                  </tr>
                ) : (
                  memRows.map(([name, info]) => (
                    <tr key={name} className={touched === name ? "anim-in" : undefined}>
                      <td>
                        <code>{name}</code>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{fmtValue(info.value)}</td>
                      <td>{info.kind}</td>
                      <td>{touched === name ? s.changed : s.stored}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{t("labs.console")}</h3>
            <Console lines={logs} />
          </div>
        </div>

        {error && (
          <div className="callout" role="alert" style={{ borderColor: "var(--danger, #e5484d)", color: "var(--danger, #e5484d)" }}>
            <strong>{error}</strong>
          </div>
        )}

        {showExplain && explainText() && (
          <div className="lab-explain" aria-live="polite">
            {explainText()}
          </div>
        )}
      </div>
    </div>
  );
}
