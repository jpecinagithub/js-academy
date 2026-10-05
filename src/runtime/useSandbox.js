import { useCallback, useState } from "react";
import { runCode } from "./sandbox.js";
import { trackEvent } from "../analytics/track.js";

/**
 * React hook around the sandboxed runtime.
 * Usage: const { lines, running, timedOut, run, clear } = useSandbox();
 */
export function useSandbox(options = {}) {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const run = useCallback(
    async (code, eventLabel) => {
      setRunning(true);
      setTimedOut(false);
      setLines([]);
      const res = await runCode(code, options);
      setLines(res.lines);
      setTimedOut(!!res.timedOut);
      setRunning(false);
      trackEvent("sandbox_run", eventLabel ? { label: eventLabel } : {});
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.timeout]
  );

  const clear = useCallback(() => {
    setLines([]);
    setTimedOut(false);
  }, []);

  return { lines, running, timedOut, run, clear };
}
