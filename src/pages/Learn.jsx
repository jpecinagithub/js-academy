import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { MODULES } from "../data/lessons/index.js";
import { useProgress } from "../state/progress.jsx";
import { ProgressBar } from "../components/ui.jsx";

export function levelLabel(t, level) {
  const k = `challenges.${level}`;
  const v = t(k);
  return v === k ? level : v;
}

/** Full curriculum index: /learn */
export function Learn() {
  const { t, L } = useI18n();
  const { progress } = useProgress();
  const doneCount = Object.keys(progress.completed).length;

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">{t("landing.modulesTitle")}</p>
        <h1>{t("nav.home")}</h1>
        <p className="lesson-tagline">{t("landing.modulesSub")}</p>
        <div className="lesson-progress-row" style={{ maxWidth: 460 }}>
          <ProgressBar value={doneCount} max={MODULES.length} label={t("home.yourProgress")} />
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
            {doneCount}/{MODULES.length} {t("home.modulesDone")}
          </span>
        </div>
      </header>
      <div className="module-list">
        {MODULES.map((m) => (
          <Link key={m.id} className="module-card" to={`/learn/${m.id}`}>
            <span className="module-num">{String(m.num).padStart(2, "0")}</span>
            <div>
              <h3>{L(m.title)}</h3>
              <p>{levelLabel(t, m.level)}</p>
            </div>
            <span className="m-status" aria-label={progress.completed[m.id] ? t("lesson.completed") : ""}>
              {progress.completed[m.id] ? "✅" : "→"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
