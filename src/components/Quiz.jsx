import { useMemo, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { CodeBlock, Markdown } from "./Markdown.jsx";

/**
 * Per-module quiz. Questions are "what will this output / why" style.
 * Best score is persisted by the parent via onFinish(score, total).
 */
export function Quiz({ quiz, best, onFinish }) {
  const { t, L } = useI18n();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const total = quiz.length;
  const score = useMemo(() => {
    if (!checked) return 0;
    return quiz.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  }, [checked, answers, quiz]);

  const allAnswered = Object.keys(answers).length === total;

  const check = () => {
    if (!allAnswered) return;
    setChecked(true);
    const s = quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    onFinish && onFinish(s, total);
  };

  const retry = () => {
    setAnswers({});
    setChecked(false);
  };

  return (
    <section className="quiz" aria-label={t("lesson.quizTitle")}>
      <div className="quiz-head">
        <span>
          {t("lesson.quizTitle")} · {total} {t("quiz.question").toLowerCase()}s
        </span>
        {best && (
          <span className="quiz-score">
            {t("quiz.best")}: {best.score}/{best.total}
          </span>
        )}
      </div>
      {quiz.map((q, i) => {
        const chosen = answers[i];
        return (
          <div key={i} className="quiz-q">
            <p style={{ fontWeight: 600, margin: "0 0 4px" }}>
              {i + 1}. {L(q.q)}
            </p>
            {q.code && <CodeBlock code={q.code} />}
            <div className="quiz-opts" role="radiogroup" aria-label={`${t("quiz.question")} ${i + 1}`}>
              {q.options.map((opt, j) => {
                const isAnswer = j === q.answer;
                const cls =
                  "quiz-opt" +
                  (checked && isAnswer ? " correct" : "") +
                  (checked && chosen === j && !isAnswer ? " wrong" : "");
                return (
                  <button
                    key={j}
                    type="button"
                    role="radio"
                    aria-checked={chosen === j}
                    className={cls}
                    disabled={checked}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  >
                    {String.fromCharCode(65 + j)}. {L(opt)}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className="quiz-feedback">
                <strong style={{ color: chosen === q.answer ? "var(--accent)" : "var(--red)" }}>
                  {chosen === q.answer ? `✓ ${t("quiz.correct")}` : `✗ ${t("quiz.incorrect")}`}
                </strong>
                {q.explanation && (
                  <div style={{ marginTop: 6 }}>
                    <em>{t("quiz.explanation")}</em> <Markdown text={L(q.explanation)} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ padding: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {!checked ? (
          <button type="button" className="btn btn-primary" onClick={check} disabled={!allAnswered}>
            {t("quiz.check")}
          </button>
        ) : (
          <>
            <span className="quiz-score" style={{ fontSize: "1.1rem" }}>
              {t("quiz.yourScore")}: {score}/{total}
            </span>
            <button type="button" className="btn btn-secondary" onClick={retry}>
              {t("quiz.tryAgain")}
            </button>
          </>
        )}
        {!checked && !allAnswered && (
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{t("quiz.selectFirst")}</span>
        )}
      </div>
    </section>
  );
}
