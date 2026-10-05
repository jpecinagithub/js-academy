import { useI18n } from "../i18n/index.jsx";

/** Renders captured sandbox console lines. */
export function Console({ lines, title }) {
  const { t } = useI18n();
  return (
    <div className="console" role="log" aria-live="polite" aria-label={title || t("labs.console")}>
      <div className="console-body">
        {lines.length === 0 ? (
          <div className="console-empty">{t("labs.noOutput")}</div>
        ) : (
          lines.map((l, i) => (
            <div key={i} className="console-line">
              <span className={`lvl lvl-${l.level}`}>{l.level.toUpperCase()}</span>
              {l.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
