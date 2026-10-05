/**
 * Curriculum registry. Lesson content is lazy-loaded per module
 * so the initial bundle stays small. Titles/taglines are duplicated
 * here (kept in sync with lesson files) so lists, search and the
 * knowledge map don't need to load every lesson.
 */

const T = (en, es) => ({ en, es });

export const MODULES = [
  { id: "what-is-js", num: 0, level: "beginner", title: T("What is JavaScript?", "¿Qué es JavaScript?"), load: () => import("./m00-what-is-js.js") },
  { id: "variables", num: 1, level: "beginner", title: T("Variables & Data Types", "Variables y tipos de datos"), load: () => import("./m01-variables.js") },
  { id: "operators", num: 2, level: "beginner", title: T("Operators", "Operadores"), load: () => import("./m02-operators.js") },
  { id: "control-flow", num: 3, level: "beginner", title: T("Control Flow", "Flujo de control"), load: () => import("./m03-control-flow.js") },
  { id: "loops", num: 4, level: "beginner", title: T("Loops", "Bucles"), load: () => import("./m04-loops.js") },
  { id: "functions", num: 5, level: "beginner", title: T("Functions", "Funciones"), load: () => import("./m05-functions.js") },
  { id: "scope", num: 6, level: "intermediate", title: T("Scope", "Ámbito"), load: () => import("./m06-scope.js") },
  { id: "arrays", num: 7, level: "beginner", title: T("Arrays", "Arrays"), load: () => import("./m07-arrays.js") },
  { id: "objects", num: 8, level: "beginner", title: T("Objects", "Objetos"), load: () => import("./m08-objects.js") },
  { id: "references", num: 9, level: "intermediate", title: T("References & Memory", "Referencias y memoria"), load: () => import("./m09-references.js") },
  { id: "dom", num: 10, level: "intermediate", title: T("The DOM", "El DOM"), load: () => import("./m10-dom.js") },
  { id: "events", num: 11, level: "intermediate", title: T("Events", "Eventos"), load: () => import("./m11-events.js") },
  { id: "callbacks", num: 12, level: "intermediate", title: T("Callbacks", "Callbacks"), load: () => import("./m12-callbacks.js") },
  { id: "async", num: 13, level: "intermediate", title: T("Asynchronous JavaScript", "JavaScript asíncrono"), load: () => import("./m13-async.js") },
  { id: "promises", num: 14, level: "intermediate", title: T("Promises", "Promesas"), load: () => import("./m14-promises.js") },
  { id: "async-await", num: 15, level: "intermediate", title: T("Async / Await", "Async / Await"), load: () => import("./m15-async-await.js") },
  { id: "fetch", num: 16, level: "intermediate", title: T("Fetch & APIs", "Fetch y APIs"), load: () => import("./m16-fetch.js") },
  { id: "errors", num: 17, level: "intermediate", title: T("Error Handling", "Manejo de errores"), load: () => import("./m17-errors.js") },
  { id: "closures", num: 18, level: "advanced", title: T("Closures", "Clausuras"), load: () => import("./m18-closures.js") },
  { id: "this", num: 19, level: "advanced", title: T("this", "this"), load: () => import("./m19-this.js") },
  { id: "prototypes", num: 20, level: "advanced", title: T("Prototypes", "Prototipos"), load: () => import("./m20-prototypes.js") },
  { id: "classes", num: 21, level: "intermediate", title: T("Classes", "Clases"), load: () => import("./m21-classes.js") },
  { id: "modules", num: 22, level: "intermediate", title: T("Modules", "Módulos"), load: () => import("./m22-modules.js") },
  { id: "storage", num: 23, level: "beginner", title: T("Browser Storage", "Almacenamiento"), load: () => import("./m23-storage.js") },
  { id: "runtime", num: 24, level: "advanced", title: T("The JavaScript Runtime", "El runtime de JavaScript"), load: () => import("./m24-runtime.js") },
];

export const TOTAL_MODULES = MODULES.length;

export function getModuleMeta(id) {
  return MODULES.find((m) => m.id === id);
}

export function moduleNeighbors(id) {
  const i = MODULES.findIndex((m) => m.id === id);
  return {
    prev: i > 0 ? MODULES[i - 1].id : null,
    next: i < MODULES.length - 1 ? MODULES[i + 1].id : null,
  };
}
