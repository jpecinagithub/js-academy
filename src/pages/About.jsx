import { useI18n } from "../i18n/index.jsx";

/** /about — discreet author section. */
export function About() {
  const { t } = useI18n();
  return (
    <div className="container">
      <header className="lesson-hero">
        <p className="lesson-kicker">👤</p>
        <h1>{t("about.title")}</h1>
      </header>
      <div className="lesson-body">
        <div className="card" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div
            aria-hidden="true"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--accent-dim)",
              border: "2px solid var(--accent)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.8rem",
              flexShrink: 0,
            }}
          >
            👨‍💻
          </div>
          <div>
            <h2 style={{ margin: "0 0 8px" }}>Jon Peciña Iturbe</h2>
            <p>{t("about.body1")}</p>
            <p>{t("about.body2")}</p>
            <p>{t("about.body3")}</p>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{t("about.contact")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 404 */
export function NotFound() {
  const { t } = useI18n();
  return (
    <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: "4rem" }} aria-hidden="true">🛰️</div>
      <h1 style={{ fontFamily: "var(--font-mono)" }}>404</h1>
      <p style={{ color: "var(--muted)" }}>ReferenceError: page is not defined</p>
      <a className="btn btn-primary" href="/" style={{ marginTop: 16 }}>
        ← {t("nav.home")}
      </a>
    </div>
  );
}
