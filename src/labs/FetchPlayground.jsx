import { useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { HighlightedCode } from "../components/highlight.jsx";

const STRINGS = {
  en: {
    title: "Fetch Playground",
    intro:
      "A 100% mock API — no network involved. Practice the fetch pattern against these endpoints and watch status codes, timing and JSON.",
    endpoint: "Endpoint",
    method: "Method",
    body: "Request body (JSON, for POST)",
    send: "Send request",
    sending: "Sending…",
    status: "Status",
    timing: "Timing",
    response: "Response",
    codeUsed: "The code that ran",
    patternTitle: "The fetch pattern",
    pattern:
      "Real code follows the same three steps: await fetch(…) → check res.ok (fetch only rejects on network failure, not on 404/500!) → await res.json().",
    step1: "await fetch(url)",
    step2: "check res.ok — throw on HTTP errors",
    step3: "await res.json()",
    noResponse: "No response yet — pick an endpoint and hit Send.",
    invalidBody: "The body is not valid JSON.",
  },
  es: {
    title: "Patio de juegos de Fetch",
    intro:
      "Una API 100% simulada — sin red de por medio. Practica el patrón de fetch contra estos endpoints y observa códigos de estado, tiempos y JSON.",
    endpoint: "Endpoint",
    method: "Método",
    body: "Cuerpo de la petición (JSON, para POST)",
    send: "Enviar petición",
    sending: "Enviando…",
    status: "Estado",
    timing: "Tiempo",
    response: "Respuesta",
    codeUsed: "El código que se ejecutó",
    patternTitle: "El patrón de fetch",
    pattern:
      "El código real sigue los mismos tres pasos: await fetch(…) → comprobar res.ok (¡fetch solo rechaza por fallos de red, no por 404/500!) → await res.json().",
    step1: "await fetch(url)",
    step2: "comprobar res.ok — lanzar error ante errores HTTP",
    step3: "await res.json()",
    noResponse: "Aún no hay respuesta — elige un endpoint y pulsa Enviar.",
    invalidBody: "El cuerpo no es JSON válido.",
  },
};

const USERS = [
  { id: 1, name: "Ada Lovelace", role: "admin" },
  { id: 2, name: "Alan Turing", role: "user" },
  { id: 3, name: "Grace Hopper", role: "user" },
];
const POSTS = [
  { id: 1, userId: 1, title: "Hello world", body: "My first post." },
  { id: 2, userId: 2, title: "On computable numbers", body: "A classic." },
];

const ENDPOINTS = ["/users", "/users/1", "/posts", "/slow", "/boom-404", "/boom-500"];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Fake fetch: same API shape as the real one (ok, status, json()), zero network. */
async function mockFetch(endpoint, method, body) {
  if (endpoint === "/slow") await delay(900);
  else await delay(220 + Math.random() * 180);

  const ok = (status, data, statusText = "") => ({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => data,
  });

  if (method === "POST" && endpoint === "/posts") {
    return ok(201, { id: 101, ...body }, "Created");
  }
  switch (endpoint) {
    case "/users":
      return ok(200, USERS);
    case "/users/1":
      return ok(200, USERS[0]);
    case "/posts":
      return ok(200, POSTS);
    case "/slow":
      return ok(200, { message: "Sorry I'm late — this endpoint is slow." });
    case "/boom-404":
      return ok(404, { error: "Not found", hint: "No such endpoint on this API." }, "Not Found");
    case "/boom-500":
      return ok(500, { error: "Internal server error", retry: true }, "Internal Server Error");
    default:
      return ok(404, { error: "Not found" }, "Not Found");
  }
}

function codeSnippet(endpoint, method, body) {
  const bodyPart =
    method === "POST"
      ? `, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${body || "{}"}),\n}`
      : "";
  return `const res = await fetch("${endpoint}"${bodyPart});
if (!res.ok) {
  throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
}
const data = await res.json();
console.log(data);`;
}

export default function FetchPlayground() {
  const { lang } = useI18n();
  const s = STRINGS[lang];
  const [endpoint, setEndpoint] = useState("/users");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState('{ "title": "My post", "userId": 2 }');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [bodyError, setBodyError] = useState(false);
  const reqId = useRef(0);

  const send = async () => {
    let parsedBody = undefined;
    if (method === "POST") {
      try {
        parsedBody = JSON.parse(body);
        setBodyError(false);
      } catch {
        setBodyError(true);
        return;
      }
    }
    const id = ++reqId.current;
    setBusy(true);
    setResult(null);
    const t0 = performance.now();
    const res = await mockFetch(endpoint, method, parsedBody);
    const data = await res.json();
    const ms = Math.round(performance.now() - t0);
    if (id !== reqId.current) return; // a newer request won
    setBusy(false);
    setResult({
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      ms,
      data,
      code: codeSnippet(endpoint, method, method === "POST" ? body : ""),
    });
  };

  const statusClass = (st) => (st < 300 ? "var(--accent)" : st < 500 ? "var(--amber)" : "var(--red)");

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="lamp" aria-hidden="true" />
        {s.title}
      </div>
      <div className="panel-body">
        <p>{s.intro}</p>

        <div className="lab-controls" role="group" aria-label={s.endpoint}>
          {ENDPOINTS.map((ep) => (
            <button
              key={ep}
              type="button"
              className={`btn btn-sm ${endpoint === ep ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setEndpoint(ep)}
              aria-pressed={endpoint === ep}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {ep}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div>
            <div className="lab-controls" style={{ marginTop: 0 }} role="group" aria-label={s.method}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", alignSelf: "center" }}>
                {s.method}:
              </span>
              {["GET", "POST"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn btn-sm ${method === m ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setMethod(m)}
                  aria-pressed={method === m}
                >
                  {m}
                </button>
              ))}
            </div>
            {method === "POST" && (
              <label>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{s.body}</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  spellCheck={false}
                  style={{ width: "100%", marginTop: 4, fontFamily: "var(--font-mono)" }}
                />
              </label>
            )}
            {bodyError && (
              <p style={{ color: "var(--red)", fontSize: "0.88rem" }} role="alert">
                {s.invalidBody}
              </p>
            )}
            <div className="lab-controls">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={send}
                disabled={busy}
              >
                {busy ? s.sending : `▶ ${s.send}`}
              </button>
            </div>

            <div className="callout">
              <strong>{s.patternTitle}</strong>
              <p>{s.pattern}</p>
              <ol style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                <li>
                  <code>{s.step1}</code>
                </li>
                <li>
                  <code>{s.step2}</code>
                </li>
                <li>
                  <code>{s.step3}</code>
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "0.9rem" }}>{s.response}</h3>
            {!result && !busy && (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{s.noResponse}</p>
            )}
            {(result || busy) && (
              <>
                <div
                  className="lab-controls"
                  style={{ marginTop: 0 }}
                  aria-live="polite"
                >
                  <span
                    className="badge"
                    style={{
                      background: "color-mix(in srgb, " + statusClass(result?.status ?? 200) + " 18%, transparent)",
                      color: statusClass(result?.status ?? 200),
                      border: "1px solid " + statusClass(result?.status ?? 200),
                    }}
                  >
                    {busy ? "…" : `${result.status} ${result.statusText}`}
                  </span>
                  <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                    {s.timing}: <strong style={{ fontFamily: "var(--font-mono)" }}>{busy ? "…" : `${result.ms} ms`}</strong>
                  </span>
                </div>
                {result && (
                  <>
                    <div className="code-block" aria-label={s.response}>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                    <h3 style={{ fontSize: "0.9rem", marginTop: 16 }}>{s.codeUsed}</h3>
                    <div className="code-block">
                      <pre>
                        <HighlightedCode code={result.code} />
                      </pre>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
