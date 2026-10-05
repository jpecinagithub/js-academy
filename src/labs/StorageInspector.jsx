import { useCallback, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Storage Inspector",
    intro:
      "The browser's two key/value stores, live. Everything this lab saves is namespaced as jsa-lab-* so it never touches the academy's own data.",
    key: "Key",
    value: "Value",
    save: "Save",
    get: "Get",
    remove: "Remove",
    clearLab: "Clear lab keys",
    entries: "Stored entries",
    noEntries: "Empty — save something first.",
    labKey: "lab key",
    gotValue: "Value",
    notFound: "not found",
    indexedTitle: "What about IndexedDB?",
    indexedBody:
      "localStorage is synchronous and only holds strings (~5 MB). IndexedDB is the heavyweight option: an asynchronous, transactional database for structured data (objects, files) with much larger quotas.",
    indexedCode: `// IndexedDB in a nutshell
const req = indexedDB.open("my-app", 1);
req.onsuccess = () => {
  const db = req.result; // use transactions from here
};`,
    clearNote: "Clear removes only keys starting with jsa-lab-*.",
    savedOk: "Saved ✓",
    removedOk: "Removed ✓",
  },
  es: {
    title: "Inspector de almacenamiento",
    intro:
      "Los dos almacenes clave/valor del navegador, en vivo. Todo lo que este laboratorio guarda usa el prefijo jsa-lab-* para no tocar los datos de la academia.",
    key: "Clave",
    value: "Valor",
    save: "Guardar",
    get: "Leer",
    remove: "Eliminar",
    clearLab: "Borrar claves del lab",
    entries: "Entradas guardadas",
    noEntries: "Vacío — guarda algo primero.",
    labKey: "clave del lab",
    gotValue: "Valor",
    notFound: "no encontrada",
    indexedTitle: "¿Y IndexedDB?",
    indexedBody:
      "localStorage es síncrono y solo guarda cadenas (~5 MB). IndexedDB es la opción pesada: una base de datos asíncrona y transaccional para datos estructurados (objetos, archivos) con cuotas mucho mayores.",
    indexedCode: `// IndexedDB en pocas palabras
const req = indexedDB.open("my-app", 1);
req.onsuccess = () => {
  const db = req.result; // usa transacciones desde aquí
};`,
    clearNote: "Borrar solo elimina las claves que empiezan por jsa-lab-*.",
    savedOk: "Guardado ✓",
    removedOk: "Eliminado ✓",
  },
};

const PREFIX = "jsa-lab-";

function readEntries(store) {
  const out = [];
  try {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      out.push({ key: k, value: store.getItem(k), lab: k.startsWith(PREFIX) });
    }
  } catch {
    /* storage unavailable */
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export default function StorageInspector() {
  const { t, lang } = useI18n();
  const s = STRINGS[lang];
  const [tab, setTab] = useState("local");
  const [key, setKey] = useState("score");
  const [value, setValue] = useState("100");
  const [entries, setEntries] = useState(() => readEntries(window.localStorage));
  const [notice, setNotice] = useState("");
  const [getResult, setGetResult] = useState(null);

  const store = tab === "local" ? window.localStorage : window.sessionStorage;

  const refresh = useCallback(() => {
    setEntries(readEntries(store));
  }, [store]);

  const switchTab = (k) => {
    setTab(k);
    setEntries(readEntries(k === "local" ? window.localStorage : window.sessionStorage));
    setGetResult(null);
    setNotice("");
  };

  const fullKey = PREFIX + key.trim();

  const doSave = () => {
    if (!key.trim()) return;
    try {
      store.setItem(fullKey, value);
      setNotice(s.savedOk);
      refresh();
    } catch {
      setNotice("⚠ " + t("labs.errorIn"));
    }
  };

  const doGet = () => {
    if (!key.trim()) return;
    let v = null;
    try {
      v = store.getItem(fullKey);
    } catch {
      /* ignore */
    }
    setGetResult({ key: fullKey, value: v });
  };

  const doRemove = () => {
    if (!key.trim()) return;
    try {
      store.removeItem(fullKey);
      setNotice(s.removedOk);
      refresh();
    } catch {
      setNotice("⚠ " + t("labs.errorIn"));
    }
  };

  const doClear = () => {
    try {
      const doomed = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k.startsWith(PREFIX)) doomed.push(k);
      }
      doomed.forEach((k) => store.removeItem(k));
      setNotice(s.removedOk);
      refresh();
    } catch {
      setNotice("⚠ " + t("labs.errorIn"));
    }
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="lab-controls" role="tablist" aria-label="Storage">
          {["local", "session"].map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              className={`btn btn-sm ${tab === k ? "btn-primary" : "btn-secondary"}`}
              onClick={() => switchTab(k)}
            >
              {k === "local" ? "localStorage" : "sessionStorage"}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div>
            <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
              <label>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{s.key}</span>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="score"
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>
              <label>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{s.value}</span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="100"
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>
            </div>
            <div className="lab-controls" style={{ marginTop: 0 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={doSave}>
                {s.save}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={doGet}>
                {s.get}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={doRemove}>
                {s.remove}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={doClear}>
                {s.clearLab}
              </button>
            </div>
            {notice && (
              <p style={{ color: "var(--accent)", fontSize: "0.88rem" }} aria-live="polite">
                {notice}
              </p>
            )}
            {getResult && (
              <div className="lab-explain" aria-live="polite" style={{ marginTop: 12 }}>
                <strong>
                  {s.gotValue} <code>{getResult.key}</code>:
                </strong>{" "}
                {getResult.value === null ? (
                  <em style={{ color: "var(--muted)" }}>{s.notFound}</em>
                ) : (
                  <code>{getResult.value}</code>
                )}
              </div>
            )}
            <p style={{ fontSize: "0.8rem", color: "var(--faint)" }}>{s.clearNote}</p>
          </div>

          <div>
            <h3 style={{ fontSize: "0.9rem" }}>
              {s.entries} — {tab === "local" ? "localStorage" : "sessionStorage"}
            </h3>
            <table className="data-table" aria-live="polite">
              <thead>
                <tr>
                  <th>KEY</th>
                  <th>{s.value.toUpperCase()}</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ color: "var(--muted)" }}>
                      {s.noEntries}
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.key}>
                      <td>
                        <code style={{ wordBreak: "break-all" }}>{e.key}</code>{" "}
                        {e.lab && <span className="badge beginner">{s.labKey}</span>}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                        {String(e.value)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="callout">
          <strong>{s.indexedTitle}</strong>
          <p>{s.indexedBody}</p>
          <div className="code-block">
            <pre>
              <HighlightedCode code={s.indexedCode} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
