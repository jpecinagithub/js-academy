import { Suspense, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider, useI18n } from "./i18n/index.jsx";
import { ProgressProvider } from "./state/progress.jsx";
import { Layout } from "./components/Layout.jsx";
import { Landing } from "./pages/Landing.jsx";
import { Home } from "./pages/Home.jsx";
import { Learn } from "./pages/Learn.jsx";
import { ModulePage } from "./pages/ModulePage.jsx";
import { LabsPage } from "./pages/LabsPage.jsx";
import { Playground } from "./pages/Playground.jsx";
import { Challenges } from "./pages/Challenges.jsx";
import { Projects } from "./pages/Projects.jsx";
import { CheatSheet } from "./pages/CheatSheet.jsx";
import { Glossary } from "./pages/Glossary.jsx";
import { KnowledgeMap } from "./pages/KnowledgeMap.jsx";
import { About, NotFound } from "./pages/About.jsx";
import { trackEvent } from "./analytics/track.js";

const THEME_KEY = "jsa-theme";

function detectTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function Shell() {
  const [theme, setTheme] = useState(detectTheme);
  const { t } = useI18n();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // PWA install prompt capture (for a future install button; event kept in memory only)
  useEffect(() => {
    const onInstalled = () => trackEvent("pwa_installed", {});
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const toggleTheme = useCallback(() => setTheme((th) => (th === "dark" ? "light" : "dark")), []);

  return (
    <Layout theme={theme} onToggleTheme={toggleTheme}>
      <Suspense
        fallback={
          <div className="loading-fallback">
            <span className="spinner" aria-hidden="true" />
            <div>{t("common.loading")}</div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<ModulePage />} />
          <Route path="/labs/:key" element={<LabsPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/map" element={<KnowledgeMap />} />
          <Route path="/about" element={<About />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ProgressProvider>
          <Shell />
          <Analytics />
        </ProgressProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
