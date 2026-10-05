import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { MODULES } from "../data/lessons/index.js";
import { useProgress } from "../state/progress.jsx";

/** /map — knowledge map; nodes reflect progress. */
export function KnowledgeMap() {
  const { t, L, lang } = useI18n();
  const { progress } = useProgress();

  const groups = [
    { key: "fundamentals", en: "Fundamentals", es: "Fundamentos", ids: ["what-is-js", "variables", "operators"] },
    { key: "logic", en: "Logic", es: "Lógica", ids: ["control-flow", "loops"] },
    { key: "functions", en: "Functions", es: "Funciones", ids: ["functions", "scope", "closures"] },
    { key: "data", en: "Data", es: "Datos", ids: ["arrays", "objects", "references"] },
    { key: "browser", en: "Browser", es: "Navegador", ids: ["dom", "events", "storage"] },
    { key: "async", en: "Async", es: "Asíncrono", ids: ["callbacks", "async", "promises", "async-await", "fetch"] },
    { key: "deep", en: "Deep JavaScript", es: "JavaScript profundo", ids: ["errors", "this", "prototypes", "classes", "modules", "runtime"] },
  ];

  const nodeClass = (id) => {
    if (progress.completed[id]) return "kmap-node done";
    if (progress.visited[id]) return "kmap-node current";
    return "kmap-node";
  };

  const titleOf = (id) => {
    const m = MODULES.find((x) => x.id === id);
    return m ? L(m.title) : id;
  };

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">🗺️</p>
        <h1>{t("map.title")}</h1>
        <p className="lesson-tagline">{t("map.sub")}</p>
      </header>

      <div style={{ display: "flex", gap: 16, margin: "8px 0 24px", flexWrap: "wrap", fontSize: "0.86rem", color: "var(--muted)" }}>
        <span><span className="kmap-node done">✓</span> {t("map.legendDone")}</span>
        <span><span className="kmap-node current">…</span> {t("map.legendCurrent")}</span>
        <span><span className="kmap-node">·</span> {t("map.legendTodo")}</span>
      </div>

      <div className="kmap">
        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)", marginBottom: 12 }}>
          JavaScript
        </div>
        {groups.map((g) => (
          <div key={g.key} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: "2px solid var(--diagram-line)" }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
              {g.key === "deep" ? "└─" : "├─"} {lang === "es" ? g.es : g.en}
            </div>
            <div>
              {g.ids.map((id) => (
                <Link key={id} to={`/learn/${id}`} className={nodeClass(id)}>
                  {progress.completed[id] ? "✓ " : ""}
                  {titleOf(id)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
