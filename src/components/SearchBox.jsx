import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { MODULES } from "../data/lessons/index.js";
import { GLOSSARY } from "../data/glossary.js";
import { CHALLENGES } from "../data/challenges.js";
import { PROJECTS } from "../data/projects.js";
import { LAB_COMPONENTS } from "../labs/index.js";

/**
 * Global search across modules, labs, glossary, challenges and cheat sheet.
 * Compact mode renders just an input in the header.
 */
export function SearchBox({ compact }) {
  const { t, L } = useI18n();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    const out = [];

    MODULES.forEach((m) => {
      const title = L(m.title);
      const hay = `${m.id} module ${m.num} ${title} módulo`.toLowerCase();
      if (hay.includes(query)) {
        out.push({ kind: t("search.modules"), label: `${t("lesson.module")} ${m.num} · ${title}`, to: `/learn/${m.id}` });
      }
    });

    Object.keys(LAB_COMPONENTS).forEach((key) => {
      if (key.replace(/-/g, " ").includes(query)) {
        out.push({ kind: t("search.labs"), label: key, to: `/labs/${key}` });
      }
    });

    GLOSSARY.forEach((g) => {
      const term = L(g.term).toLowerCase();
      if (term.includes(query)) {
        out.push({ kind: t("search.glossary"), label: L(g.term), to: `/glossary#${g.term.en.toLowerCase().replace(/\s+/g, "-")}` });
      }
    });

    CHALLENGES.forEach((c) => {
      if (L(c.title).toLowerCase().includes(query)) {
        out.push({ kind: t("search.challenges"), label: L(c.title), to: `/challenges#${c.id}` });
      }
    });

    PROJECTS.forEach((p) => {
      if (L(p.title).toLowerCase().includes(query)) {
        out.push({ kind: t("search.projects"), label: L(p.title), to: `/projects#${p.id}` });
      }
    });

    return out.slice(0, 12);
  }, [q, t, L]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  if (compact) {
    return (
      <div className="search-wrap" ref={wrapRef} style={{ margin: 0, maxWidth: 200 }}>
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          style={{ width: "100%", minHeight: 36, fontSize: "0.84rem" }}
        />
        {open && results.length > 0 && (
          <div className="search-results" role="listbox">
            {results.map((r, i) => (
              <Link key={i} to={r.to} onClick={() => { setOpen(false); setQ(""); }}>
                <span className="sr-kind">{r.kind}</span>
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
