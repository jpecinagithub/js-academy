import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "jsa-progress-v1";

const EMPTY = {
  visited: {}, // moduleId -> ISO timestamp
  completed: {}, // moduleId -> true
  quizScores: {}, // moduleId -> { score, total }
  challenges: {}, // challengeId -> true
  labsExplored: {}, // labKey -> true
  lastLesson: null,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return { ...EMPTY };
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage full / private mode — non-fatal */
    }
  }, [progress]);

  const patch = useCallback((fn) => setProgress((p) => fn(p)), []);

  const visitModule = useCallback(
    (id) =>
      patch((p) => ({
        ...p,
        lastLesson: id,
        visited: { ...p.visited, [id]: new Date().toISOString() },
      })),
    [patch]
  );

  const completeModule = useCallback(
    (id) => patch((p) => ({ ...p, completed: { ...p.completed, [id]: true } })),
    [patch]
  );

  const saveQuiz = useCallback(
    (id, score, total) =>
      patch((p) => {
        const prev = p.quizScores[id];
        const best = !prev || score > prev.score ? { score, total } : prev;
        return { ...p, quizScores: { ...p.quizScores, [id]: best } };
      }),
    [patch]
  );

  const completeChallenge = useCallback(
    (id) => patch((p) => ({ ...p, challenges: { ...p.challenges, [id]: true } })),
    [patch]
  );

  const exploreLab = useCallback(
    (key) => patch((p) => ({ ...p, labsExplored: { ...p.labsExplored, [key]: true } })),
    [patch]
  );

  const resetAll = useCallback(() => setProgress({ ...EMPTY }), []);

  const value = useMemo(
    () => ({
      progress,
      visitModule,
      completeModule,
      saveQuiz,
      completeChallenge,
      exploreLab,
      resetAll,
    }),
    [progress, visitModule, completeModule, saveQuiz, completeChallenge, exploreLab, resetAll]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
