import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { trackEvent } from "../analytics/track.js";
import { SearchBox } from "./SearchBox.jsx";

export function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label="Language / Idioma">
      {["es", "en"].map((l) => (
        <button
          key={l}
          type="button"
          className={lang === l ? "active" : ""}
          onClick={() => {
            setLang(l);
            trackEvent("language_changed", { lang: l });
          }}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function ThemeSwitch({ theme, onToggle }) {
  const { lang } = useI18n();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onToggle}
      aria-label={theme === "dark" ? (lang === "es" ? "Cambiar a modo claro" : "Switch to light mode") : (lang === "es" ? "Cambiar a modo oscuro" : "Switch to dark mode")}
      title={theme === "dark" ? "☀" : "☾"}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}

const NAV_LINKS = [
  { to: "/learn", key: "nav.home" },
  { to: "/playground", key: "nav.playground" },
  { to: "/challenges", key: "nav.challenges" },
  { to: "/projects", key: "nav.projects" },
  { to: "/cheatsheet", key: "nav.cheatsheet" },
  { to: "/glossary", key: "nav.glossary" },
  { to: "/map", key: "nav.map" },
];

export function Layout({ theme, onToggleTheme, children }) {
  const { t } = useI18n();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t("nav.skip")}
      </a>
      <header className="site-header">
        <div className="container">
          <Link className="brand" to="/" aria-label="JavaScript Fundamentals Academy">
            <span className="brand-mark" aria-hidden="true">{"{ } "}</span>
            <span>
              JS Academy <small>· {t("meta.tagline").split(" ").slice(0, 2).join(" ")}</small>
            </span>
          </Link>
          <button
            type="button"
            className="icon-btn mobile-nav-toggle"
            aria-expanded={navOpen}
            aria-label={t("nav.menu")}
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? "✕" : "☰"}
          </button>
          <nav className={`main-nav${navOpen ? " open" : ""}`} aria-label="Main">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setNavOpen(false)}>
                {t(l.key)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <SearchBox compact />
            <LanguageSwitch />
            <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <strong style={{ color: "var(--text)" }}>JavaScript Fundamentals Academy</strong>
              <p style={{ margin: "6px 0" }}>{t("footer.tagline")}</p>
              <span className="privacy-note">
                <span className="dot" aria-hidden="true" /> {t("footer.privacy")}
              </span>
            </div>
            <nav aria-label="Footer">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to}>
                  {t(l.key)}
                </Link>
              ))}
              <Link to="/about">{t("nav.about")}</Link>
            </nav>
          </div>
          <p style={{ marginTop: 20, fontSize: "0.82rem" }}>{t("footer.createdBy")}</p>
        </div>
      </footer>
    </div>
  );
}
