import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { MODULES } from "../data/lessons/index.js";
import { useProgress } from "../state/progress.jsx";
import { ProgressBar } from "../components/ui.jsx";
import { trackEvent } from "../analytics/track.js";

/** /home — personal dashboard (also reachable; landing is "/"). */
export function Home() {
  const { t, L } = useI18n();
  const { progress, resetAll } = useProgress();

  const doneModules = Object.keys(progress.completed).length;
  const doneChallenges = Object.keys(progress.challenges).length;
  const doneLabs = Object.keys(progress.labsExplored).length;
  const quizScores = Object.values(progress.quizScores);
  const quizAvg =
    quizScores.length > 0
      ? Math.round((quizScores.reduce((a, s) => a + s.score / s.total, 0) / quizScores.length) * 100)
      : 0;

  const nextModule = MODULES.find((m) => !progress.completed[m.id]) || null;

  const quick = [
    { to: "/playground", icon: "⌨️", title: t("home.qPlayground"), desc: t("home.qPlaygroundD") },
    { to: "/labs/event-loop", icon: "🔁", title: t("home.qEventLoop"), desc: t("home.qEventLoopD") },
    { to: "/labs/array-lab", icon: "🧬", title: t("home.qArrayLab"), desc: t("home.qArrayLabD") },
    { to: "/labs/dom-playground", icon: "🌳", title: t("home.qDomLab"), desc: t("home.qDomLabD") },
    { to: "/challenges", icon: "🏁", title: t("home.qChallenges"), desc: t("home.qChallengesD") },
    { to: "/cheatsheet", icon: "📋", title: t("home.qCheat"), desc: t("home.qCheatD") },
  ];

  const doReset = () => {
    if (window.confirm(t("home.resetConfirm"))) resetAll();
  };

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">{t("home.yourProgress")}</p>
        <h1>{t("home.title")}</h1>
        <p className="lesson-tagline">{t("home.subtitle")}</p>
      </header>

      <div className="dash-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {nextModule
              ? `${t("home.resumeModule")} ${nextModule.num} — ${L(nextModule.title)}`
              : t("lesson.completed")}
          </h3>
          <div style={{ margin: "12px 0" }}>
            <ProgressBar value={doneModules} max={MODULES.length} label={t("home.yourProgress")} />
          </div>
          <p style={{ color: "var(--muted)" }}>
            {doneModules}/{MODULES.length} {t("home.modulesDone")}
          </p>
          {nextModule ? (
            <Link
              className="btn btn-primary"
              to={`/learn/${nextModule.id}`}
              onClick={() => trackEvent("lesson_opened", { module: nextModule.id })}
            >
              {t("home.continue")} →
            </Link>
          ) : (
            <Link className="btn btn-secondary" to="/learn">
              {t("lesson.backToPath")}
            </Link>
          )}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t("home.yourProgress")}</h3>
          <div className="stat-row" style={{ gridTemplateColumns: "1fr 1fr", margin: 0 }}>
            <div className="stat">
              <div className="v">{doneModules}</div>
              <div className="l">{t("home.modulesDone")}</div>
            </div>
            <div className="stat">
              <div className="v">{doneChallenges}</div>
              <div className="l">{t("home.challengesDone")}</div>
            </div>
            <div className="stat">
              <div className="v">{doneLabs}</div>
              <div className="l">{t("home.labsDone")}</div>
            </div>
            <div className="stat">
              <div className="v">{quizAvg}%</div>
              <div className="l">{t("home.quizAvg")}</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">{t("home.quickTitle")}</h2>
      <div className="quick-links">
        {quick.map((q) => (
          <Link key={q.to} className="quick-link" to={q.to}>
            <span style={{ fontSize: "1.4rem" }} aria-hidden="true">
              {q.icon}
            </span>
            <span>
              {q.title}
              <small>{q.desc}</small>
            </span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={doReset}>
          {t("home.resetProgress")}
        </button>
      </div>
    </div>
  );
}
