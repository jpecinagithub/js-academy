import { useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useSandbox } from "../runtime/useSandbox.js";
import { CodeEditor } from "../components/CodeEditor.jsx";
import { Console } from "../components/Console.jsx";

const EXAMPLES = {
  hello: `// Say hello — then change the message and run again
const name = "Ada";
console.log("Hello, " + name + "!");`,
  loop: `// Watch the runtime iterate
for (let i = 0; i < 5; i++) {
  console.log("iteration", i);
}`,
  async: `// The famous order: what prints first?
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`,
};

/** /playground — free JS bench: editor + output + console. */
export function Playground() {
  const { t } = useI18n();
  const [code, setCode] = useState(() => {
    // Pick up a starter draft saved by the Projects page ("Open in Playground").
    try {
      const draft = localStorage.getItem("jsa-playground-draft");
      if (draft !== null) {
        localStorage.removeItem("jsa-playground-draft");
        return draft;
      }
    } catch {
      /* ignore */
    }
    return EXAMPLES.hello;
  });
  const { lines, running, timedOut, run, clear } = useSandbox();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container wide">
      <header className="lesson-hero" style={{ paddingBottom: 0 }}>
        <p className="lesson-kicker">JS</p>
        <h1>{t("playground.title")}</h1>
        <p className="lesson-tagline">{t("playground.sub")}</p>
      </header>

      <div className="pg-examples" role="group" aria-label={t("playground.examples")}>
        <span style={{ color: "var(--muted)", fontSize: "0.88rem", alignSelf: "center" }}>
          {t("playground.examples")}:
        </span>
        {[
          ["hello", t("playground.exHello")],
          ["loop", t("playground.exLoop")],
          ["async", t("playground.exAsync")],
        ].map(([k, label]) => (
          <button key={k} type="button" className="btn btn-sm btn-secondary" onClick={() => setCode(EXAMPLES[k])}>
            {label}
          </button>
        ))}
      </div>

      <div className="pg-layout">
        <div className="pg-editor">
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" aria-hidden="true" /> {t("playground.editor")}
            </div>
            <div style={{ padding: 12 }}>
              <div className="pg-toolbar">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => run(code, "playground")} disabled={running}>
                  {running ? t("labs.running") : `▶ ${t("playground.run")}`}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCode("")}>
                  {t("playground.reset")}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
                  {t("playground.copy")}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={download}>
                  {t("playground.download")}
                </button>
              </div>
              <CodeEditor value={code} onChange={setCode} minHeight={380} />
              <p style={{ fontSize: "0.8rem", color: "var(--faint)", margin: "8px 0 0" }}>
                🔒 {t("playground.localNote")}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="lamp" aria-hidden="true" /> {t("playground.consoleTitle")}
            </div>
            <div style={{ padding: 12, display: "grid", gap: 12 }}>
              {timedOut && <p style={{ color: "var(--amber)", margin: 0 }}>⚠ {t("labs.timedOut")}</p>}
              <Console lines={lines} />
              <button type="button" className="btn btn-ghost btn-sm" onClick={clear} style={{ justifySelf: "start" }}>
                {t("playground.clearConsole")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
