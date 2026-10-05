import { useI18n } from "../i18n/index.jsx";

/** Small UI atoms: progress bar, badges, section titles. */
export function ProgressBar({ value, max = 100, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        style={{ flex: 1 }}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)" }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

export function Badge({ level }) {
  const { t } = useI18n();
  const key = `challenges.${level}`;
  const label = t(key) === key ? level : t(key);
  return <span className={`badge ${level}`}>{label}</span>;
}

export function SectionHead({ title, sub }) {
  return (
    <div>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}
