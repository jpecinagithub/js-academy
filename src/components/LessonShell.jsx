import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { useProgress } from "../state/progress.jsx";
import { trackEvent } from "../analytics/track.js";
import { useSandbox } from "../runtime/useSandbox.js";
import { CodeBlock, Markdown } from "./Markdown.jsx";
import { Console } from "./Console.jsx";
import { Quiz } from "./Quiz.jsx";
import { Badge } from "./ui.jsx";
import { LAB_COMPONENTS } from "../labs/index.js";

/** Runnable snippet: code block + run button + captured console. */
function RunnableCode({ code, caption, label }) {
  const { t } = useI18n();
  const { lines, running, timedOut, run, clear } = useSandbox();
  const [hasRun, setHasRun] = useState(false);

  const doRun = async () => {
    setHasRun(true);
    await run(code, label || "lesson");
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <CodeBlock code={code} caption={caption} runnable onRun={doRun} />
      <div className="lab-controls">
        <button type="button" className="btn btn-sm btn-primary" onClick={doRun} disabled={running}>
          {running ? t("labs.running") : `▶ ${t("labs.run")}`}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={clear}>
          {t("labs.clear")}
        </button>
      </div>
      {timedOut && <p style={{ color: "var(--amber)" }}>⚠ {t("labs.timedOut")}</p>}
      {(hasRun || lines.length > 0) && <Console lines={lines} />}
      <p style={{ fontSize: "0.8rem", color: "var(--faint)", marginTop: 8 }}>🔒 {t("lesson.sandboxNote")}</p>
    </div>
  );
}

function LabSlot({ labKey }) {
  const { t } = useI18n();
  const { exploreLab } = useProgress();
  const factory = LAB_COMPONENTS[labKey];
  const Lab = useMemo(() => (factory ? lazy(factory) : null), [factory]);

  useEffect(() => {
    if (factory) {
      exploreLab(labKey);
      trackEvent("lab_opened", { lab: labKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labKey]);

  if (!Lab) return <div className="lab-stub">{t("labs.comingSoon")}</div>;
  return (
    <Suspense fallback={<div className="loading-fallback">{t("common.loading")}</div>}>
      <Lab />
    </Suspense>
  );
}

function Section({ section, index }) {
  const { t, L } = useI18n();
  switch (section.type) {
    case "concept":
      return (
        <section>
          <h2>
            <span className="sec-num">{String(index + 1).padStart(2, "0")}</span> {L(section.heading)}
          </h2>
          <Markdown text={L(section.body)} />
        </section>
      );
    case "visual":
      return (
        <section aria-label={L(section.caption) || "diagram"}>
          <div className="diagram">
            <pre>{section.diagram}</pre>
          </div>
          {section.caption && <p className="code-caption">{L(section.caption)}</p>}
          {section.body && <Markdown text={L(section.body)} />}
        </section>
      );
    case "code":
      return (
        <section>
          {section.heading && (
            <h2>
              <span className="sec-num">{String(index + 1).padStart(2, "0")}</span> {L(section.heading)}
            </h2>
          )}
          <RunnableCode code={section.code} caption={section.caption && L(section.caption)} label={section.label} />
          {section.body && <Markdown text={L(section.body)} />}
        </section>
      );
    case "lab":
      return (
        <section>
          {section.heading && (
            <h2>
              <span className="sec-num">{String(index + 1).padStart(2, "0")}</span> {L(section.heading)}
            </h2>
          )}
          {section.body && <Markdown text={L(section.body)} />}
          <LabSlot labKey={section.lab} />
        </section>
      );
    case "mistake":
      return (
        <section>
          <h2>
            <span className="sec-num">{String(index + 1).padStart(2, "0")}</span> {t("lesson.commonMistake")}
          </h2>
          <div className="mistake-box">
            <h4>✗ {t("lesson.commonMistake")}</h4>
            <CodeBlock code={section.wrong} />
          </div>
          <Markdown text={L(section.explanation)} />
          <div className="fix-box">
            <h4 style={{ margin: "0 0 6px", color: "var(--accent)", fontSize: "0.95rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ✓ {t("lesson.theFix")}
            </h4>
            <CodeBlock code={section.right} />
          </div>
        </section>
      );
    case "takeaway":
      return (
        <aside className="takeaway">
          <strong style={{ display: "block", marginBottom: 6, color: "var(--accent)" }}>
            {t("lesson.takeaway")}
          </strong>
          <Markdown text={L(section.body)} />
        </aside>
      );
    case "underhood":
      return (
        <details className="underhood">
          <summary>
            ⚙️ {section.title ? L(section.title) : t("lesson.underHood")}
          </summary>
          <div className="uh-body">
            <Markdown text={L(section.body)} />
          </div>
        </details>
      );
    case "challenge-ref":
      return (
        <div className="callout">
          🏁 <strong>{t("lesson.relatedChallenge")}:</strong>{" "}
          <Link to={`/challenges#${section.challenge}`}>{t("lesson.openChallenge")} →</Link>
        </div>
      );
    default:
      return null;
  }
}

/**
 * Renders a full lesson from data:
 * concept → visual → code → interactive(lab) → sandbox → mistake → challenge → takeaway
 */
export function LessonShell({ lesson, prevId, nextId }) {
  const { t, L } = useI18n();
  const { progress, visitModule, completeModule, saveQuiz } = useProgress();

  useEffect(() => {
    visitModule(lesson.id);
    trackEvent("lesson_opened", { module: lesson.id });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const completed = !!progress.completed[lesson.id];
  const best = progress.quizScores[lesson.id];

  const markComplete = () => {
    completeModule(lesson.id);
    trackEvent("lesson_completed", { module: lesson.id });
  };

  return (
    <article>
      <header className="lesson-hero">
        <div className="lesson-kicker">
          {t("lesson.module")} {lesson.module} · <Badge level={lesson.level} />
        </div>
        <h1>{L(lesson.title)}</h1>
        {lesson.tagline && <p className="lesson-tagline">{L(lesson.tagline)}</p>}
        <div className="lesson-progress-row">
          {!completed ? (
            <button type="button" className="btn btn-primary" onClick={markComplete}>
              ✓ {t("lesson.markComplete")}
            </button>
          ) : (
            <span className="btn btn-secondary" aria-live="polite">
              {t("lesson.completed")}
            </span>
          )}
        </div>
      </header>

      <div className="lesson-body">
        {lesson.sections.map((s, i) => (
          <Section key={i} section={s} index={i} />
        ))}

        {lesson.quiz && lesson.quiz.length > 0 && (
          <Quiz
            quiz={lesson.quiz}
            best={best}
            onFinish={(score, total) => {
              saveQuiz(lesson.id, score, total);
              trackEvent("quiz_completed", { module: lesson.id });
            }}
          />
        )}

        <hr className="divider" />
        <nav style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }} aria-label="Module navigation">
          {prevId ? (
            <Link className="btn btn-secondary" to={`/learn/${prevId}`}>
              ← {t("lesson.prevModule")}
            </Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link className="btn btn-primary" to={`/learn/${nextId}`}>
              {t("lesson.nextModule")} →
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/challenges">
              {t("home.qChallenges")} →
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
