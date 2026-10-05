import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getModuleMeta, moduleNeighbors } from "../data/lessons/index.js";
import { LessonShell } from "../components/LessonShell.jsx";
import { useI18n } from "../i18n/index.jsx";

/** /learn/:id — lazy-loads the lesson data file, then renders the shell. */
export function ModulePage() {
  const { id } = useParams();
  const { t } = useI18n();
  const [lesson, setLesson] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setLesson(null);
    setFailed(false);
    const meta = getModuleMeta(id);
    if (!meta) {
      setFailed(true);
      return;
    }
    meta
      .load()
      .then((mod) => {
        if (alive) setLesson(mod.default);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (failed) return <Navigate to="/404" replace />;

  if (!lesson) {
    return (
      <div className="container">
        <div className="loading-fallback">
          <span className="spinner" aria-hidden="true" />
          <div>{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  const { prev, next } = moduleNeighbors(id);
  return (
    <div className="container">
      <LessonShell lesson={lesson} prevId={prev} nextId={next} />
    </div>
  );
}
