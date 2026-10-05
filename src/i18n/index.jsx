import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.js";
import es from "./es.js";

const STRINGS = { en, es };
const STORAGE_KEY = "jsa-lang";

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("es") ? "es" : "en";
}

const LangContext = createContext(null);

/** Lookup helper: t("nav.home") with optional {name} interpolation. */
function lookup(strings, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), strings);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
  }, [lang ]);

  const t = useCallback(
    (path, vars) => {
      let s = lookup(STRINGS[lang], path);
      if (s === undefined) s = lookup(STRINGS.en, path);
      if (s === undefined) return path;
      if (vars && typeof s === "string") {
        return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
      }
      return s;
    },
    [lang]
  );

  /** Localized field: pick field.en / field.es from lesson data. Falls back to the other language. */
  const L = useCallback(
    (field) => {
      if (field == null) return "";
      if (typeof field === "string") return field;
      return field[lang] ?? field.en ?? field.es ?? "";
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, L }), [lang, t, L]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
