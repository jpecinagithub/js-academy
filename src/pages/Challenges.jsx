import { useEffect, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useProgress } from "../state/progress.jsx";
import { trackEvent } from "../analytics/track.js";
import { runCode } from "../runtime/sandbox.js";
import { CHALLENGES, buildHarness } from "../data/challenges.js";
import { CodeEditor } from "../components/CodeEditor.jsx";
import { Markdown } from "../components/Markdown.jsx";
import { Badge } from "../components/ui.jsx";

function ChallengeCard({ challenge, solved, onOpen, active }) {
  const { L } = useI18n();
  return (
    <button
      type="button"
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
        <h3>
          {L(challenge.title)} {solved && <span aria-label="solved">✅</span>}
        </h3>
        <p>
          <Badge level={challenge.level} />
        </p>
      </div>
      <span className="m-status">{active ? "▾" : "▸"}</span>
    </button>
  );
}

function Solver({ challenge }) {
  const { t, L } = useI18n();
  const { completeChallenge } = useProgress();
  const [code, setCode] = useState(challenge.starter);
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setCode(challenge.starter);
    setResults(null);
    setShowHint(false);
  }, [challenge.id, challenge.starter]);

  const runTests = async () => {
    setRunning(true);
    setResults(null);
    const harness = buildHarness(code, challenge.tests, challenge.helpers || "");
    const res = await runCode(harness, { timeout: 4000 });
    const ret = res.lines.find((l) => l.level === "return");
    let parsed = null;
    if (ret) {
      // sandbox formats the returned array; re-evaluate safely is overkill —
      // instead we re-run a JSON variant locally is not possible (sandboxed).
      // Our formatter output is deterministic; parse the known shape instead:
      parsed = tryParseResults(ret.text);
    }
    if (res.timedOut) {
      setResults({ timedOut: true });
    } else if (parsed) {
      setResults({ tests: parsed });
      if (parsed.every((r) => r.pass)) {
        completeChallenge(challenge.id);
        trackEvent("challenge_completed", { challenge: challenge.id });
      }
    } else {
      const errLine = res.lines.find((l) => l.level === "error");
      setResults({ error: errLine ? errLine.text : "?" });
    }
    setRunning(false);
  };

  const allPass = results?.tests?.every((r) => r.pass);

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <Markdown text={L(challenge.description)} />
      <div className="pg-toolbar" style={{ marginTop: 12 }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={runTests} disabled={running}>
          {running ? t("labs.running") : `▶ ${t("challenges.runTests")}`}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode(challenge.starter)}>
          {t("challenges.reset")}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowHint((s) => !s)}>
          💡 {t("challenges.showHint")}
        </button>
      </div>
      {showHint && (
        <div className="callout">
          <strong>{t("challenges.hint")}: </strong>
          {L(challenge.hint)}
        </div>
      )}
      <h4 style={{ margin: "12px 0 8px" }}>{t("challenges.yourSolution")}</h4>
      <CodeEditor value={code} onChange={setCode} minHeight={200} />
      {results?.timedOut && <p style={{ color: "var(--amber)" }}>⚠ {t("labs.timedOut")}</p>}
      {results?.error && (
        <div className="mistake-box" style={{ marginTop: 12 }}>
          <h4>{t("labs.errorIn")}</h4>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.84rem" }}>{results.error}</pre>
        </div>
      )}
      {results?.tests && (
        <div style={{ marginTop: 12 }}>
          {results.tests.map((r, i) => (
            <div
              key={i}
              className="console-line"
              style={{ color: r.pass ? "var(--accent)" : "var(--red)" }}
            >
              {r.pass ? "✓" : "✗"} <code>{r.call}</code>
              {!r.pass && (
                <span style={{ color: "var(--muted)" }}>
                  {" "}
                  — expected <code>{JSON.stringify(r.expected)}</code>, got{" "}
                  <code>{JSON.stringify(r.actual)}</code>
                </span>
              )}
            </div>
          ))}
          <p style={{ fontWeight: 700, color: allPass ? "var(--accent)" : "var(--muted)" }}>
            {allPass
              ? `🎉 ${t("challenges.allPassed")}`
              : `${results.tests.filter((r) => r.pass).length}/${results.tests.length} ${t("challenges.testsPassed")}`}
          </p>
          {!allPass && <p style={{ color: "var(--muted)" }}>{t("challenges.someFailed")}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Parse the sandbox's returned JSON string back into test results.
 * The sandbox formatter JSON-quotes strings, so the text is a
 * JSON-encoded JSON string: parse twice.
 */
function tryParseResults(text) {
  try {
    const inner = JSON.parse(text.replace(/^→\s*/, "").trim());
    const parsed = JSON.parse(inner);
    if (Array.isArray(parsed) && parsed.every((r) => typeof r.pass === "boolean")) return parsed;
    return null;
  } catch {
    return null;
  }
}

/** /challenges */
export function Challenges() {
  const { t } = useI18n();
  const { progress } = useProgress();
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(CHALLENGES[0]?.id);

  const visible = CHALLENGES.filter((c) => filter === "all" || c.level === filter);
  const active = CHALLENGES.find((c) => c.id === activeId) || visible[0];

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && CHALLENGES.some((c) => c.id === hash)) setActiveId(hash);
  }, []);

  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">🏁</p>
        <h1>{t("challenges.title")}</h1>
        <p className="lesson-tagline">{t("challenges.sub")}</p>
      </header>

      <div className="lab-controls" role="group" aria-label={t("challenges.difficulty")}>
        {["all", "beginner", "intermediate", "advanced"].map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {t(`challenges.${f}`)}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="module-list" style={{ margin: 0 }}>
          {visible.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              solved={!!progress.challenges[c.id]}
              active={active?.id === c.id}
              onOpen={() => setActiveId(c.id)}
            />
          ))}
        </div>
        <div>{active && <Solver key={active.id} challenge={active} />}</div>
      </div>
    </div>
  );
}
