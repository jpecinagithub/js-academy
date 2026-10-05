import { track as vercelTrack } from "@vercel/analytics";

/**
 * Product analytics without personal data.
 * Never pass user code, keystrokes or identifiers — only event names
 * and coarse labels (module id, lab key, language).
 */
const ALLOWED = new Set([
  "lesson_opened",
  "lesson_completed",
  "sandbox_run",
  "challenge_completed",
  "language_changed",
  "pwa_installed",
  "quiz_completed",
  "lab_opened",
]);

export function trackEvent(name, props = {}) {
  if (!ALLOWED.has(name)) return;
  try {
    // Strip anything that isn't a short string/number/boolean.
    const clean = {};
    for (const [k, v] of Object.entries(props)) {
      if (typeof v === "string" && v.length <= 80) clean[k] = v;
      else if (typeof v === "number" || typeof v === "boolean") clean[k] = v;
    }
    vercelTrack(name, clean);
  } catch {
    /* analytics must never break the app */
  }
}
