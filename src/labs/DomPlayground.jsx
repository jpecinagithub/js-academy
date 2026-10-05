import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { CodeEditor } from "../components/CodeEditor.jsx";
import { Console } from "../components/Console.jsx";

const STRINGS = {
  en: {
    title: "DOM Playground",
    sub: "Write HTML and JavaScript side by side — the preview updates live in a sandboxed iframe.",
    html: "HTML",
    js: "JavaScript",
    preview: "Preview (live)",
    consoleTitle: "Preview console",
    reset: "Reset example",
    sandboxTitle: "Why is the preview sandboxed?",
    sandboxBody:
      "The preview runs inside an <iframe sandbox=\"allow-scripts\">. That flag lets your JavaScript run but blocks it from reaching the rest of the page — no access to the academy's own DOM, storage, or popups. Your code can only touch the preview document, which makes experimenting safe.",
  },
  es: {
    title: "Patio de juegos del DOM",
    sub: "Escribe HTML y JavaScript lado a lado — la vista previa se actualiza en vivo en un iframe aislado.",
    html: "HTML",
    js: "JavaScript",
    preview: "Vista previa (en vivo)",
    consoleTitle: "Consola de la vista previa",
    reset: "Restablecer ejemplo",
    sandboxTitle: "¿Por qué la vista previa está aislada (sandbox)?",
    sandboxBody:
      "La vista previa se ejecuta dentro de un <iframe sandbox=\"allow-scripts\">. Esa opción permite que tu JavaScript se ejecute pero le impide alcanzar el resto de la página — sin acceso al DOM, almacenamiento ni ventanas emergentes de la academia. Tu código solo puede tocar el documento de la vista previa, lo que hace que experimentar sea seguro.",
  },
};

const DEFAULT_HTML = `<h2>DOM playground</h2>
<p>Click the button — JavaScript will change it.</p>
<button id="hello">Hello</button>`;

const DEFAULT_JS = `const btn = document.querySelector("#hello");

btn.addEventListener("click", () => {
  btn.textContent = "¡Hola, JavaScript!";
  console.log("Button clicked! New text:", btn.textContent);
});`;

function buildSrcDoc(html, js, token) {
  // A tiny console bridge: forwards console.* calls to the parent via postMessage.
  // The sandbox (allow-scripts, no allow-same-origin) keeps the iframe opaque-origin,
  // so it cannot touch the parent document — it can only send messages.
  const bridge = `
(function () {
  var TOKEN = ${JSON.stringify(token)};
  function fmt(v) {
    try {
      if (typeof v === "string") return v;
      return JSON.stringify(v);
    } catch (e) { return String(v); }
  }
  ["log", "warn", "error", "info"].forEach(function (m) {
    var orig = console[m].bind(console);
    console[m] = function () {
      var args = Array.prototype.slice.call(arguments).map(fmt);
      try { parent.postMessage({ __domLab: TOKEN, method: m, args: args }, "*"); } catch (e) {}
      orig.apply(null, arguments);
    };
  });
  window.addEventListener("error", function (e) {
    try { parent.postMessage({ __domLab: TOKEN, method: "error", args: ["Uncaught: " + e.message] }, "*"); } catch (err) {}
  });
})();`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body { font-family: system-ui, sans-serif; padding: 16px; line-height: 1.5; }
  button { padding: 8px 18px; font-size: 15px; border-radius: 8px; cursor: pointer; }
</style>
</head>
<body>
${html}
<script>${bridge}
${js}
</scr` + `ipt>
</body>
</html>`;
}

export default function DomPlayground() {
  const { lang, t } = useI18n();
  const s = STRINGS[lang];

  const [init] = useState(() => {
    let js = DEFAULT_JS;
    try {
      // Projects can hand off starter code via localStorage.
      const draft = localStorage.getItem("jsa-domplayground-draft");
      if (draft) {
        localStorage.removeItem("jsa-domplayground-draft");
        js = draft;
      }
    } catch {
      /* ignore */
    }
    return { js };
  });
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [js, setJs] = useState(init.js);
  const [srcDoc, setSrcDoc] = useState(() => buildSrcDoc(DEFAULT_HTML, init.js, "init"));
  const [lines, setLines] = useState([]);
  const [token, setToken] = useState(() => `domlab-${Math.random().toString(36).slice(2, 10)}`);
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  const debounce = useRef(null);

  // Listen to console messages from the sandboxed iframe
  useEffect(() => {
    const handler = (e) => {
      const d = e.data;
      if (!d || d.__domLab !== tokenRef.current) return;
      const level = d.method === "error" ? "error" : d.method === "warn" ? "warn" : "log";
      setLines((prev) => [...prev.slice(-99), { level, text: d.args.join(" ") }]);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Debounced preview updates (~600ms after typing stops)
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const next = `domlab-${Math.random().toString(36).slice(2, 10)}`;
      setToken(next);
      setSrcDoc(buildSrcDoc(html, js, next));
    }, 600);
    return () => clearTimeout(debounce.current);
  }, [html, js]);

  const resetExample = () => {
    setHtml(DEFAULT_HTML);
    setJs(DEFAULT_JS);
    setLines([]);
  };

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>{s.sub}</p>

      <div className="lab-controls">
        <button className="btn btn-secondary btn-sm" onClick={resetExample}>
          {s.reset}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setLines([])}>
          {t("labs.clear")}
        </button>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.html}
          </div>
          <div className="panel-body">
            <CodeEditor value={html} onChange={setHtml} label={s.html} minHeight={200} id="dom-html" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.js}
          </div>
          <div className="panel-body">
            <CodeEditor value={js} onChange={setJs} label={s.js} minHeight={200} id="dom-js" />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="lamp" />
            {s.preview}
          </div>
          <div className="panel-body">
            <iframe
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              title={s.preview}
              style={{
                width: "100%",
                height: 300,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-m)",
                background: "#fff",
              }}
            />
          </div>
        </div>
        <div>
          <Console lines={lines} title={s.consoleTitle} />
          <div className="callout" style={{ marginTop: 16 }}>
            <strong>{s.sandboxTitle}</strong>
            <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{s.sandboxBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
