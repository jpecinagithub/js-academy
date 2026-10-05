import { Suspense, lazy, useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useI18n } from "../i18n/index.jsx";
import { LAB_COMPONENTS, LAB_META } from "../labs/index.js";
import { useProgress } from "../state/progress.jsx";
import { trackEvent } from "../analytics/track.js";

/** /labs/:key — standalone laboratory view. */
export function LabsPage() {
  const { key } = useParams();
  const { t } = useI18n();
  const { exploreLab } = useProgress();
  const factory = LAB_COMPONENTS[key];

  useEffect(() => {
    if (factory) {
      exploreLab(key);
      trackEvent("lab_opened", { lab: key });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const Lab = useMemo(() => (factory ? lazy(factory) : null), [factory]);

  if (!factory) return <Navigate to="/404" replace />;

  const icon = LAB_META[key]?.icon || "🧪";
  const pretty = key.replace(/-/g, " ");

  return (
    <div className="container wide">
      <header className="lesson-hero" style={{ paddingBottom: 0 }}>
        <p className="lesson-kicker">
          <Link to="/learn" style={{ color: "var(--accent)" }}>
            ← {t("nav.home")}
          </Link>
        </p>
        <h1 style={{ textTransform: "capitalize" }}>
          <span aria-hidden="true">{icon}</span> {pretty}
        </h1>
        <p className="lesson-tagline">🔒 {t("lesson.sandboxNote")}</p>
      </header>
      <Suspense fallback={<div className="loading-fallback">{t("common.loading")}</div>}>
        {Lab && <Lab />}
      </Suspense>
    </div>
  );
}
