import { useMemo, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { CHEATSHEET } from "../data/cheatsheet.js";
import { CodeBlock } from "../components/Markdown.jsx";

/** /cheatsheet — searchable quick reference. */
export function CheatSheet() {
  const { t, L } = useI18n();
  const [q, setQ] = useState("");

  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return CHEATSHEET;
    return CHEATSHEET.map((s) => ({
      ...s,
      entries: s.entries.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.code.toLowerCase().includes(query) ||
          L(e.note).toLowerCase().includes(query)
      ),
    })).filter((s) => s.entries.length > 0);
  }, [q, L]);

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">📋</p>
        <h1>{t("cheatsheet.title")}</h1>
        <p className="lesson-tagline">{t("cheatsheet.sub")}</p>
      </header>

      <div className="search-wrap">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("cheatsheet.searchPh")}
          aria-label={t("cheatsheet.searchPh")}
          style={{ width: "100%" }}
        />
      </div>

      {sections.length === 0 && <p style={{ color: "var(--muted)" }}>{t("cheatsheet.noResults")}</p>}

      {sections.map((s, i) => (
        <section key={i} style={{ marginBottom: 28 }}>
          <h2 className="section-title" style={{ marginTop: 24 }}>{L(s.section)}</h2>
          <div className="grid-2">
            {s.entries.map((e, j) => (
              <div key={j} className="card">
                <h3 style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{e.name}</h3>
                <CodeBlock code={e.code} />
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "8px 0 0" }}>{L(e.note)}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
