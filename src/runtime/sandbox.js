/**
 * Sandboxed JavaScript runtime.
 *
 * User code NEVER runs in the React app's context. Each execution gets a
 * fresh, hidden <iframe sandbox="allow-scripts"> fed via srcDoc. The iframe
 * captures console output and posts it back via postMessage. The parent
 * verifies event.source and enforces an execution timeout: on timeout the
 * iframe is destroyed (so `while(true){}` can't freeze the app) and a new
 * one is created for the next run.
 */

const SRCDOC = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function () {
  "use strict";

  function fmt(v, depth, seen) {
    depth = depth || 0;
    seen = seen || [];
    if (v === null) return "null";
    var t = typeof v;
    if (t === "undefined") return "undefined";
    if (t === "string") return JSON.stringify(v);
    if (t === "number" || t === "boolean") return String(v);
    if (t === "bigint") return String(v) + "n";
    if (t === "symbol") return v.toString();
    if (t === "function") return "ƒ " + (v.name || "anonymous") + "()";
    if (v instanceof Error) return v.name + ": " + v.message;
    if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
    for (var i = 0; i < seen.length; i++) { if (seen[i] === v) return "[Circular]"; }
    seen.push(v);
    try {
      if (Array.isArray(v)) {
        return "[ " + v.map(function (x) { return fmt(x, depth + 1, seen); }).join(", ") + " ]";
      }
      var keys = Object.keys(v);
      var shown = keys.slice(0, 24).map(function (k) {
        return JSON.stringify(k) + ": " + fmt(v[k], depth + 1, seen);
      });
      return "{ " + shown.join(", ") + (keys.length > 24 ? ", …" : "") + " }";
    } catch (e) {
      return "[Object]";
    }
  }

  function send(type, text, level) {
    parent.postMessage({ type: type, level: level || "log", text: String(text).slice(0, 4000) }, "*");
  }

  ["log", "info", "debug"].forEach(function (k) {
    console[k] = function () {
      send("console", Array.prototype.map.call(arguments, function (a) { return fmt(a); }).join(" "), "log");
    };
  });
  console.warn = function () {
    send("console", Array.prototype.map.call(arguments, function (a) { return fmt(a); }).join(" "), "warn");
  };
  console.error = function () {
    send("console", Array.prototype.map.call(arguments, function (a) { return fmt(a); }).join(" "), "error");
  };

  // Dialogs are meaningless (and blocked) inside the sandbox: explain instead.
  window.alert = function () { send("console", "⚠ alert() is disabled in the sandbox — use console.log instead.", "warn"); };
  window.prompt = function () { send("console", "⚠ prompt() is disabled in the sandbox.", "warn"); return null; };
  window.confirm = function () { send("console", "⚠ confirm() is disabled in the sandbox.", "warn"); return false; };

  window.onerror = function (message) {
    send("error", message);
  };

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (!d || d.type !== "run") return;
    function done() { parent.postMessage({ type: "done" }, "*"); }
    function fail(err) {
      var msg = err && err.stack ? String(err.stack).split("\\n").slice(0, 3).join("\\n") : String(err);
      send("error", msg);
    }
    var ret;
    try {
      ret = new Function('"use strict";\\n' + d.code)();
    } catch (err) {
      fail(err);
      done();
      return;
    }
    // If user code returns a promise (async run), wait for it before
    // reporting completion — enables async tests (the watchdog still guards).
    if (ret && typeof ret.then === "function") {
      ret.then(
        function (v) {
          if (typeof v !== "undefined") send("return", "→ " + fmt(v), "return");
          done();
        },
        function (err) { fail(err); done(); }
      );
    } else {
      if (typeof ret !== "undefined") send("return", "→ " + fmt(ret), "return");
      done();
    }
  });

  parent.postMessage({ type: "ready" }, "*");
})();
<\/script></body></html>`;

const DEFAULT_TIMEOUT = 3000;
const DEFAULT_MAX_LINES = 200;

/**
 * Run JS code in an isolated sandbox.
 * @returns Promise<{ lines: Array<{level, text}>, timedOut: boolean }>
 */
export function runCode(code, options = {}) {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const maxLines = options.maxLines || DEFAULT_MAX_LINES;

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("tabindex", "-1");
    iframe.style.cssText =
      "position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none;";

    const lines = [];
    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(result);
    };

    const timer = setTimeout(() => finish({ lines, timedOut: true }), timeout);

    function onMessage(e) {
      if (e.source !== iframe.contentWindow) return;
      const d = e.data || {};
      if (d.type === "ready") {
        try {
          iframe.contentWindow.postMessage({ type: "run", code: String(code) }, "*");
        } catch {
          finish({ lines, timedOut: false });
        }
      } else if (d.type === "console") {
        if (lines.length < maxLines) lines.push({ level: d.level || "log", text: d.text });
      } else if (d.type === "error") {
        if (lines.length < maxLines) lines.push({ level: "error", text: d.text });
      } else if (d.type === "return") {
        if (lines.length < maxLines) lines.push({ level: "return", text: d.text });
      } else if (d.type === "done") {
        finish({ lines, timedOut: false });
      }
    }

    window.addEventListener("message", onMessage);
    iframe.srcdoc = SRCDOC;
    document.body.appendChild(iframe);
  });
}
