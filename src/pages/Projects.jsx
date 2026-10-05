import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { PROJECTS } from "../data/projects.js";
import { CodeBlock } from "../components/Markdown.jsx";
import { Badge } from "../components/ui.jsx";

const DRAFT_KEY = "jsa-playground-draft";

function ProjectCard({ project, active, onOpen }) {
  const { L } = useI18n();
  return (
    <button
      type="button"
      id={project.id}
      onClick={onOpen}
      className="module-card"
      style={{
        width: "100%",
        textAlign: "left",
        borderColor: active ? "var(--accent)" : undefined,
        cursor: "pointer",
      }}
      aria-expanded={active}
    >
      <div>
        <h3>{L(project.title)}</h3>
        <p>{L(project.description)}</p>
        <p style={{ marginTop: 6 }}>
          <Badge level={project.level} />
        </p>
      </div>
      <span className="m-status">{active ? "▾" : "▸"}</span>
    </button>
  );
}

function ProjectDetail({ project, onBack }) {
  const { t, L } = useI18n();
  const navigate = useNavigate();
  const [done, setDone] = useState({});

  const toggleGoal = (i) =>
    setDone((d) => ({ ...d, [`${project.id}-${i}`]: !d[`${project.id}-${i}`] }));

  const openInPlayground = () => {
    // DOM projects need a DOM: hand their starter to the DOM Lab instead.
    const isDom = project.lab === "/labs/dom-playground";
    try {
      localStorage.setItem(isDom ? "jsa-domplayground-draft" : DRAFT_KEY, project.starter);
    } catch {
      /* ignore */
    }
    navigate(project.lab);
  };

  const doneCount = project.goals.filter((_, i) => done[`${project.id}-${i}`]).length;

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="pg-toolbar" style={{ marginBottom: 4 }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
          ← {t("projects.backToProjects")}
        </button>
      </div>
      <h2 style={{ marginTop: 4 }}>
        {L(project.title)} <Badge level={project.level} />
      </h2>
      <p style={{ color: "var(--muted)" }}>{L(project.description)}</p>

      <h3 style={{ fontSize: "0.95rem", margin: "16px 0 8px" }}>
        {t("projects.goals")} ({doneCount}/{project.goals.length})
      </h3>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
        {project.goals.map((g, i) => {
          const key = `${project.id}-${i}`;
          return (
            <li key={i}>
              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  color: done[key] ? "var(--muted)" : "var(--text)",
                  textDecoration: done[key] ? "line-through" : "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!done[key]}
                  onChange={() => toggleGoal(i)}
                  style={{ marginTop: 4 }}
                />
                {L(g)}
              </label>
            </li>
          );
        })}
      </ul>

      <h3 style={{ fontSize: "0.95rem", margin: "16px 0 8px" }}>{t("projects.starterCode")}</h3>
      <CodeBlock code={project.starter} />

      <div className="pg-toolbar" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={openInPlayground}>
          ▶ {t(project.lab === "/labs/dom-playground" ? "projects.openInDomLab" : "projects.openInPlayground")}
        </button>
        <Link to={project.lab} className="btn btn-secondary btn-sm">
          {t("projects.openLab")}
        </Link>
      </div>
    </div>
  );
}

/** /projects */
export function Projects() {
  const { t } = useI18n();

  const readHash = () => {
    const hash = window.location.hash.slice(1);
    return PROJECTS.some((p) => p.id === hash) ? hash : null;
  };

  const [activeId, setActiveId] = useState(readHash);

  useEffect(() => {
    const onHash = () => setActiveId(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const active = PROJECTS.find((p) => p.id === activeId) || null;

  const open = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">🛠️</p>
        <h1>{t("projects.title")}</h1>
        <p className="lesson-tagline">{t("projects.sub")}</p>
      </header>

      <div className="module-list" style={{ margin: 0 }}>
        {PROJECTS.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            active={active?.id === p.id}
            onOpen={() => open(p.id)}
          />
        ))}
      </div>

      {active && <ProjectDetail project={active} onBack={() => setActiveId(null)} />}
    </div>
  );
}
