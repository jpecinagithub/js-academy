import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { MODULES } from "../data/lessons/index.js";
import { useProgress } from "../state/progress.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

/** Animated terminal showing the call stack growing and shrinking. */
function RuntimeDemo() {
  const { t } = useI18n();
  const frames = [
    { stack: ["global()"], out: [] },
    { stack: ["calculate()", "global()"], out: [] },
    { stack: ["sum()", "calculate()", "global()"], out: [] },
    { stack: ["sum()", "calculate()", "global()"], out: ['"Learn by doing"'] },
    { stack: ["calculate()", "global()"], out: ['"Learn by doing"'] },
    { stack: ["global()"], out: ['"Learn by doing"'] },
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 1100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f = frames[i];
  return (
    <div className="term-window" aria-hidden="true">
      <div className="term-bar">
        <i /><i /><i />
        <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
          {t("landing.demoRuntime")}
        </span>
      </div>
      <div className="term-body">
        <div style={{ color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>CALL STACK</div>
        {f.stack.map((s, k) => (
          <div key={k} style={{ paddingLeft: k * 18, color: k === 0 ? "var(--amber)" : "#c9d4e2" }}>
            {"└─ ".repeat(0)}{k === 0 ? "▶ " : "· "}{s}
          </div>
        ))}
        <div style={{ color: "var(--accent)", fontWeight: 700, margin: "14px 0 8px" }}>CONSOLE</div>
        {f.out.length === 0 ? (
          <div style={{ color: "var(--faint)" }}>…</div>
        ) : (
          f.out.map((o, k) => <div key={k} style={{ color: "#c9d4e2" }}>› console.log({o})</div>)
        )}
      </div>
    </div>
  );
}

const DEMO_CODE = `function sum(a, b) {
  return a + b;          // ← pushed on the stack
}

function calculate() {
  const total = sum(20, 22);
  console.log("Learn by doing");
}

calculate();`;

export function Landing() {
  const { t, L } = useI18n();
  const { progress } = useProgress();
  const doneCount = Object.keys(progress.completed).length;

  const levelLabel = (level) => {
    const k = `challenges.${level}`;
    const v = t(k);
    return v === k ? level : v;
  };

  const features = [1, 2, 3, 4, 5, 6].map((n) => ({
    icon: ["🔬", "🧪", "🗺️", "🏁", "🔒", "🌐"][n - 1],
    title: t(`landing.feature${n}t`),
    desc: t(`landing.feature${n}d`),
  }));

  return (
    <div className="container">
      <section className="hero">
        <p className="lesson-kicker">{t("landing.kicker")}</p>
        <h1>
          {t("landing.titleA")}
          <br />
          <span className="hl">{t("landing.titleB")}</span>
        </h1>
        <p className="hero-sub">{t("landing.sub")}</p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/learn">
            {t("landing.ctaStart")} →
          </Link>
          <Link className="btn btn-secondary" to="/playground">
            {t("landing.ctaPlayground")}
          </Link>
        </div>
        <div className="hero-demo">
          <div className="term-window" aria-hidden="true">
            <div className="term-bar">
              <i /><i /><i />
              <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
                {t("landing.demoCode")}
              </span>
            </div>
            <div className="term-body">
              <HighlightedCode code={DEMO_CODE} />
            </div>
          </div>
          <RuntimeDemo />
        </div>
      </section>

      <section>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          {t("landing.philosophy")}
        </h2>
        <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
          {t("landing.philosophyD")}
        </p>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="f-ico" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">{t("landing.modulesTitle")}</h2>
        <p className="section-sub">{t("landing.modulesSub")}</p>
        <div className="module-list">
          {MODULES.map((m) => (
            <Link key={m.id} className="module-card" to={`/learn/${m.id}`}>
              <span className="module-num">{String(m.num).padStart(2, "0")}</span>
              <div>
                <h3>{L(m.title)}</h3>
                <p>{levelLabel(m.level)}</p>
              </div>
              <span className="m-status" aria-label={progress.completed[m.id] ? t("lesson.completed") : ""}>
                {progress.completed[m.id] ? "✅" : "→"}
              </span>
            </Link>
          ))}
        </div>
        <p style={{ color: "var(--muted)" }}>
          {doneCount}/{MODULES.length} {t("home.modulesDone")}
        </p>
      </section>
    </div>
  );
}
