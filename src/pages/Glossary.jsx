import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { GLOSSARY } from "../data/glossary.js";
import { Markdown, CodeBlock } from "../components/Markdown.jsx";

/** /glossary — searchable term definitions with examples + module links. */
export function Glossary() {
  const { t, L } = useI18n();
  const [q, setQ] = useState("");

  const terms = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return GLOSSARY;
    return GLOSSARY.filter(
      (g) => L(g.term).toLowerCase().includes(query) || L(g.def).toLowerCase().includes(query)
    );
  }, [q, L]);

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">📖</p>
        <h1>{t("glossary.title")}</h1>
        <p className="lesson-tagline">{t("glossary.sub")}</p>
      </header>

      <div className="search-wrap">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("glossary.searchPh")}
          aria-label={t("glossary.searchPh")}
          style={{ width: "100%" }}
        />
      </div>

      {terms.length === 0 && <p style={{ color: "var(--muted)" }}>{t("glossary.noResults")}</p>}

      <div className="grid-2" style={{ alignItems: "start" }}>
        {terms.map((g, i) => (
          <article
            key={i}
            id={g.term.en.toLowerCase().replace(/\s+/g, "-")}
            className="card"
            style={{ scrollMarginTop: 80 }}
          >
            <h3 style={{ fontSize: "1.15rem", color: "var(--accent)" }}>{L(g.term)}</h3>
            <Markdown text={L(g.def)} />
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 0 }}>
              {t("glossary.example")}
            </p>
            <CodeBlock code={g.example} />
            <Link to={`/learn/${g.module}`} className="btn btn-sm btn-secondary">
              {t("glossary.learnMore")} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
